#!/usr/bin/env tsx

/**
 * Test script for Decent Espresso shot uploads
 * Simulates the actual POST request from the Decent machine's TCL plugin
 *
 * Usage:
 *   pnpm decent:upload <shot-file> [options]
 *
 * Options:
 *   --url <url>           Endpoint URL (default: http://localhost:3000/api/decent-shots)
 *   --email <email>       User email (or set DECENT_EMAIL env var)
 *   --secret <key>        Secret key (or set DECENT_SECRET_KEY env var)
 *   --help                Show this help message
 *
 * Examples:
 *   # Local development
 *   pnpm decent:upload src/__tests__/fixtures/decent-shots/20230427T143835.json
 *
 *   # With explicit credentials
 *   pnpm decent:upload shot.json --email user@example.com --secret abc123
 *
 *   # Production endpoint
 *   pnpm decent:upload shot.json --url https://your-app.netlify.app/api/decent-shots
 *
 * Environment variables:
 *   DECENT_EMAIL       - Default email for authentication
 *   DECENT_SECRET_KEY  - Default secret key for authentication
 *   DECENT_ENDPOINT    - Default endpoint URL
 */

import { readFileSync } from "fs";
import { basename } from "path";

interface UploadOptions {
  url: string;
  email: string;
  secretKey: string;
  filePath: string;
}

function parseArgs(): UploadOptions | null {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    showHelp();
    return null;
  }

  if (args.length === 0) {
    console.error("❌ Error: Shot file path required\n");
    showHelp();
    process.exit(1);
  }

  const filePath = args[0];
  let url = process.env.DECENT_ENDPOINT || "http://localhost:3000/api/decent-shots";
  let email = process.env.DECENT_EMAIL || "";
  let secretKey = process.env.DECENT_SECRET_KEY || "";

  // Parse options
  for (let i = 1; i < args.length; i++) {
    if (args[i] === "--url" && args[i + 1]) {
      url = args[i + 1];
      i++;
    } else if (args[i] === "--email" && args[i + 1]) {
      email = args[i + 1];
      i++;
    } else if (args[i] === "--secret" && args[i + 1]) {
      secretKey = args[i + 1];
      i++;
    }
  }

  if (!email) {
    console.error("❌ Error: Email required (use --email or set DECENT_EMAIL env var)\n");
    showHelp();
    process.exit(1);
  }

  if (!secretKey) {
    console.error(
      "❌ Error: Secret key required (use --secret or set DECENT_SECRET_KEY env var)\n",
    );
    showHelp();
    process.exit(1);
  }

  return { url, email, secretKey, filePath };
}

function showHelp() {
  console.log(`
📤 Decent Espresso Upload Test Script

Simulates the actual POST request from a Decent machine's TCL plugin.

Usage:
  pnpm decent:upload <shot-file> [options]

Options:
  --url <url>           Endpoint URL (default: http://localhost:3000/api/decent-shots)
  --email <email>       User email (or set DECENT_EMAIL env var)
  --secret <key>        Secret key (or set DECENT_SECRET_KEY env var)
  --help, -h            Show this help message

Examples:
  # Local development with env vars
  export DECENT_EMAIL="user@example.com"
  export DECENT_SECRET_KEY="your-secret-key"
  pnpm decent:upload src/__tests__/fixtures/decent-shots/20230427T143835.json

  # With explicit credentials
  pnpm decent:upload shot.json --email user@example.com --secret abc123

  # Production endpoint
  pnpm decent:upload shot.json --url https://your-app.netlify.app/api/decent-shots

  # Firebase Function (local emulator)
  pnpm decent:upload shot.json --url http://127.0.0.1:5001/brewlog-dev/europe-west2/decentUpload

Environment Variables:
  DECENT_EMAIL       - Default email for authentication
  DECENT_SECRET_KEY  - Default secret key for authentication
  DECENT_ENDPOINT    - Default endpoint URL
`);
}

async function uploadShot(options: UploadOptions) {
  const { url, email, secretKey, filePath } = options;

  console.log("\n🚀 Decent Shot Upload Test");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Read file
  let fileContent: Buffer;
  try {
    fileContent = readFileSync(filePath);
    console.log(`📁 File: ${filePath}`);
    console.log(`📊 Size: ${(fileContent.length / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error(`❌ Error reading file: ${error}`);
    process.exit(1);
  }

  // Determine MIME type
  const filename = basename(filePath);
  const mimeType = filename.endsWith(".json") ? "application/json" : "application/octet-stream";
  console.log(`📝 Type: ${mimeType}`);

  // Create multipart/form-data boundary (matches TCL plugin behavior)
  const boundary = `--------${Math.floor(Date.now() / 1000)}`;

  // Build multipart body (exactly as TCL plugin does)
  const contentHeader = `Content-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n`;
  const bodyParts = [
    Buffer.from(`--${boundary}\r\n${contentHeader}\r\n`, "utf-8"),
    fileContent,
    Buffer.from(`\r\n--${boundary}--\r\n`, "utf-8"),
  ];
  const body = Buffer.concat(bodyParts);

  // Create Basic auth header
  const auth = Buffer.from(`${email}:${secretKey}`).toString("base64");

  console.log(`🔐 Auth: ${email}:${"*".repeat(secretKey.length)}`);
  console.log(`🌐 Endpoint: ${url}`);
  console.log("\n⏳ Uploading...\n");

  // Send request
  const startTime = Date.now();
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": `multipart/form-data; charset=utf-8; boundary=${boundary}`,
      },
      body,
    });

    const duration = Date.now() - startTime;
    const responseText = await response.text();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    if (response.ok) {
      console.log(`✅ Success! (${response.status} ${response.statusText})`);
      console.log(`⏱️  Duration: ${duration}ms`);

      try {
        const data = JSON.parse(responseText);
        console.log(`📋 Response:`, JSON.stringify(data, null, 2));

        if (data.id) {
          console.log(`\n🎯 Shot ID: ${data.id}`);
          console.log(`🔗 View at: ${url.replace(/\/api\/.*$/, "")}/drinks/espresso/${data.id}`);
        }
      } catch {
        console.log(`📋 Response: ${responseText}`);
      }
    } else {
      console.log(`❌ Failed! (${response.status} ${response.statusText})`);
      console.log(`⏱️  Duration: ${duration}ms`);
      console.log(`📋 Response: ${responseText}`);

      // Helpful error messages
      if (response.status === 401) {
        console.log("\n💡 Tip: Check that your email and secret key are correct");
      } else if (response.status === 409) {
        console.log("\n💡 Tip: This shot was already uploaded (duplicate)");
      } else if (response.status === 500) {
        console.log("\n💡 Tip: Check server logs for errors (database connection, etc.)");
      }

      process.exit(1);
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`❌ Request Failed (${duration}ms)`);
    console.error(`📋 Error: ${error}`);

    if (error instanceof Error && error.message.includes("ECONNREFUSED")) {
      console.log("\n💡 Tip: Is the server running? Try: pnpm dev");
    } else if (error instanceof Error && error.message.includes("fetch is not defined")) {
      console.log("\n💡 Tip: Node.js 18+ required for fetch API");
    }

    process.exit(1);
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

// Main
const options = parseArgs();
if (options) {
  uploadShot(options).catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
