#!/usr/bin/env node

/**
 * Cleanup script to remove src/pages/ after migration
 * Only run this after verifying the migration worked!
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const PAGES_DIR = path.join(__dirname, '../src/pages');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('⚠️  WARNING: This will permanently delete src/pages/\n');
  console.log('Before running this, make sure you have:');
  console.log('  ✓ Run the migration script');
  console.log('  ✓ Tested your app (pnpm start)');
  console.log('  ✓ Run type check (pnpm type-check)');
  console.log('  ✓ Run tests (pnpm test:e2e)');
  console.log('  ✓ Reviewed git diff\n');

  const answer = await ask('Are you sure you want to delete src/pages/? (yes/no): ');

  if (answer.toLowerCase() !== 'yes') {
    console.log('\n❌ Cancelled. Pages folder NOT deleted.');
    rl.close();
    return;
  }

  const confirmAnswer = await ask('\nType "DELETE" to confirm: ');

  if (confirmAnswer !== 'DELETE') {
    console.log('\n❌ Cancelled. Pages folder NOT deleted.');
    rl.close();
    return;
  }

  try {
    if (!fs.existsSync(PAGES_DIR)) {
      console.log('\n✓ Pages folder already deleted or does not exist.');
      rl.close();
      return;
    }

    // Delete the folder
    fs.rmSync(PAGES_DIR, { recursive: true, force: true });
    console.log('\n✅ Successfully deleted src/pages/');
    console.log('\nNext steps:');
    console.log('  1. git add -A');
    console.log('  2. git commit -m "Remove pages folder after TanStack Router migration"');
  } catch (error) {
    console.error(`\n❌ Error deleting pages folder: ${error.message}`);
    console.log('\nYou can manually delete it with: rm -rf src/pages/');
  }

  rl.close();
}

main();
