#!/usr/bin/env node

/**
 * Script to migrate page components into TanStack Router route files
 *
 * This script:
 * 1. Finds all route files that import from ../pages/
 * 2. Reads the imported page component
 * 3. Merges the component into the route file
 * 4. Adjusts import paths (adds extra ../ since routes are deeper)
 * 5. Updates react-router navigation to TanStack Router navigation
 * 6. Removes the page import
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROUTES_DIR = path.join(__dirname, '../src/routes');
const PAGES_DIR = path.join(__dirname, '../src/pages');

// Track what we've done
const migrationLog = [];
let filesProcessed = 0;
let filesSkipped = 0;

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
  console.log(logMessage);
  migrationLog.push(logMessage);
}

/**
 * Get all .tsx files recursively from a directory
 */
function getAllTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Extract the page import from a route file
 * Returns: { importLine, componentName, pagePath } or null
 */
function extractPageImport(routeContent, routeFilePath) {
  // Match patterns like:
  // import { Home } from "../../../pages/Home";
  // import BeansAdd from "../../../../pages/beans/BeansAdd";
  const importRegex = /import\s+(?:{?\s*(\w+)\s*}?|(\w+))\s+from\s+["']([^"']*\/pages\/[^"']*)["'];?/;
  const match = routeContent.match(importRegex);

  if (!match) return null;

  const componentName = match[1] || match[2];
  const importPath = match[3];
  const importLine = match[0];

  // Calculate the actual page file path
  const routeDir = path.dirname(routeFilePath);
  const pageFilePath = path.resolve(routeDir, importPath + '.tsx');

  return { importLine, componentName, pagePath: pageFilePath };
}

/**
 * Adjust import paths in the page component
 * Since routes are deeper in the tree, we need more ../
 */
function adjustImportPaths(pageContent, routeFilePath, pageFilePath) {
  const routeDir = path.dirname(routeFilePath);
  const pageDir = path.dirname(pageFilePath);

  // Count how many levels deep the route is from src/
  const routeDepth = routeFilePath.split('/routes/')[1].split('/').length - 1;
  const pageDepth = pageFilePath.split('/pages/')[1].split('/').length - 1;

  // Calculate additional ../ needed
  const additionalLevels = routeDepth - pageDepth;

  if (additionalLevels <= 0) return pageContent;

  // Add extra ../ to relative imports
  const additionalPath = '../'.repeat(additionalLevels);

  return pageContent.replace(
    /from\s+["'](\.\.[^"']*?)["']/g,
    (match, importPath) => {
      return `from "${additionalPath}${importPath}"`;
    }
  );
}

/**
 * Update react-router navigation to TanStack Router
 */
function updateNavigation(content) {
  // This is a basic replacement - you may need to manually fix complex cases

  // Update useNavigate import
  content = content.replace(
    /import\s*{\s*useNavigate\s*}\s*from\s*["']react-router-dom["']/g,
    'import { useNavigate } from "@tanstack/react-router"'
  );

  // Update Link imports
  content = content.replace(
    /import\s*{\s*Link(?:\s+as\s+\w+)?\s*}\s*from\s*["']react-router-dom["']/g,
    'import { Link } from "@tanstack/react-router"'
  );

  // Flag navigate calls that might need manual updating
  if (content.includes('navigate(') && content.includes('useNavigate')) {
    log('⚠️  Contains navigate() calls - may need manual review for TanStack Router syntax', 'warn');
  }

  return content;
}

/**
 * Extract component code from page file
 */
function extractComponentCode(pageContent, componentName) {
  // Remove imports section (we'll handle those separately)
  const importsEndMatch = pageContent.match(/\n\n(?!import)/);
  const importsEndIndex = importsEndMatch ? importsEndMatch.index : 0;

  const imports = pageContent.slice(0, importsEndIndex).trim();
  const code = pageContent.slice(importsEndIndex).trim();

  // Check if it's a default export and needs conversion
  let componentCode = code;

  // Convert default export to function declaration
  if (code.includes('export default')) {
    componentCode = code
      .replace(/export\s+default\s+/, '')
      .replace(/;?\s*$/, '');

    // If it's just a variable, convert to function
    if (componentCode.startsWith('const ')) {
      componentCode = componentCode.replace(
        /const\s+(\w+):\s*React\.FC\s*=\s*\(\)\s*=>\s*/,
        `function ${componentName}() `
      );
    }
  }

  // Remove React.FC type annotations as they're in function now
  componentCode = componentCode
    .replace(/:\s*React\.FC\s*=\s*\(\)\s*=>/, '() ')
    .replace(/export\s+const\s+/, 'function ')
    .replace(/:\s*React\.FC<.*?>\s*=/, ' =');

  return { imports, componentCode };
}

/**
 * Merge imports from page into route
 */
function mergeImports(routeImports, pageImports) {
  const routeImportLines = routeImports.split('\n').filter(l => l.trim());
  const pageImportLines = pageImports.split('\n').filter(l => l.trim());

  // Deduplicate and combine
  const allImports = new Set([...routeImportLines, ...pageImportLines]);

  // Sort: tanstack first, then react, then third-party, then local
  const sorted = Array.from(allImports).sort((a, b) => {
    const getOrder = (imp) => {
      if (imp.includes('@tanstack/react-router')) return 0;
      if (imp.includes('react')) return 1;
      if (imp.includes('firebase')) return 2;
      if (!imp.includes('../')) return 3;
      return 4;
    };
    return getOrder(a) - getOrder(b);
  });

  return sorted.join('\n');
}

/**
 * Main migration function for a single route file
 */
function migrateRouteFile(routeFilePath) {
  log(`Processing: ${path.relative(process.cwd(), routeFilePath)}`);

  const routeContent = fs.readFileSync(routeFilePath, 'utf8');
  const pageImport = extractPageImport(routeContent, routeFilePath);

  if (!pageImport) {
    log('  ↳ No page import found, skipping');
    filesSkipped++;
    return;
  }

  const { importLine, componentName, pagePath } = pageImport;

  if (!fs.existsSync(pagePath)) {
    log(`  ↳ Page file not found: ${pagePath}`, 'error');
    filesSkipped++;
    return;
  }

  log(`  ↳ Found page import: ${componentName} from ${path.relative(PAGES_DIR, pagePath)}`);

  // Read page content
  let pageContent = fs.readFileSync(pagePath, 'utf8');

  // Adjust import paths
  pageContent = adjustImportPaths(pageContent, routeFilePath, pagePath);

  // Update navigation
  pageContent = updateNavigation(pageContent);

  // Extract component code
  const { imports: pageImports, componentCode } = extractComponentCode(pageContent, componentName);

  // Build new route file content
  const routeImportsMatch = routeContent.match(/^(import[\s\S]*?\n\n)/);
  const routeImports = routeImportsMatch ? routeImportsMatch[1].replace(importLine, '').trim() : '';
  const routeRest = routeContent.replace(/^import[\s\S]*?\n\n/, '').trim();

  // Merge imports
  const mergedImports = mergeImports(routeImports, pageImports);

  // Build final content
  const newContent = `${mergedImports}\n\n${routeRest}\n\n${componentCode}\n`;

  // Write back
  fs.writeFileSync(routeFilePath, newContent, 'utf8');
  log(`  ✓ Migrated successfully`);
  filesProcessed++;
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Starting pages-to-routes migration...\n');

  // Get all route files
  const routeFiles = getAllTsxFiles(ROUTES_DIR);
  log(`Found ${routeFiles.length} route files`);

  // Process each route file
  routeFiles.forEach(routeFile => {
    try {
      migrateRouteFile(routeFile);
    } catch (error) {
      log(`Error processing ${routeFile}: ${error.message}`, 'error');
      filesSkipped++;
    }
  });

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Migration Summary:');
  console.log(`  ✓ Files processed: ${filesProcessed}`);
  console.log(`  ⊘ Files skipped: ${filesSkipped}`);
  console.log('='.repeat(60) + '\n');

  // Write log file
  const logPath = path.join(__dirname, '../migration-log.txt');
  fs.writeFileSync(logPath, migrationLog.join('\n'), 'utf8');
  console.log(`📝 Full log written to: ${logPath}\n`);

  // Ask about deleting pages folder
  console.log('⚠️  NEXT STEPS:');
  console.log('1. Review the migrated files');
  console.log('2. Run your app and test');
  console.log('3. Fix any navigation calls that need TanStack Router syntax');
  console.log('4. When ready, delete src/pages/:\n');
  console.log('   rm -rf src/pages\n');
}

main();
