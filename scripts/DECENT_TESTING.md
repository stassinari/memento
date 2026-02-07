# Testing Decent Shot Uploads

## Quick Test Script

A script that simulates the exact POST request from a Decent machine's TCL plugin.

### Setup (One-Time)

```bash
# Get your secret key from Settings page first, then:
export DECENT_EMAIL="your-email@example.com"
export DECENT_SECRET_KEY="your-secret-key-from-settings-page"
```

Or add to `.env.local` (gitignored):

```bash
DECENT_EMAIL=your-email@example.com
DECENT_SECRET_KEY=your-secret-key
```

### Usage

```bash
# Test local endpoint (default)
pnpm decent:upload src/__tests__/fixtures/decent-shots/20230427T143835.json

# Test with different endpoint
pnpm decent:upload shot.json --url https://staging.your-app.com/api/decent-shots

# Test Firebase Function emulator
pnpm decent:upload shot.json --url http://127.0.0.1:5001/brewlog-dev/europe-west2/decentUpload

# Show help
pnpm decent:upload --help
```

### Example Output

```log
🚀 Decent Shot Upload Test
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 File: src/__tests__/fixtures/decent-shots/20230427T143835.json
📊 Size: 31.90 KB
📝 Type: application/json
🔐 Auth: user@example.com:****************
🌐 Endpoint: http://localhost:3000/api/decent-shots

⏳ Uploading...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Success! (200 OK)
⏱️  Duration: 245ms
📋 Response: {
  "id": "abc123xyz789"
}

🎯 Shot ID: abc123xyz789
🔗 View at: http://localhost:3000/drinks/espresso/abc123xyz789
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Testing Scenarios

### 1. Test Both Formats

```bash
# JSON format
pnpm decent:upload src/__tests__/fixtures/decent-shots/20230427T143835.json

# TCL (.shot) format
pnpm decent:upload src/__tests__/fixtures/decent-shots/20230427T143835.shot
```

### 2. Test Duplicate Detection

```bash
# Upload same shot twice
pnpm decent:upload shot.json
pnpm decent:upload shot.json  # Should return 409 Conflict
```

### 3. Test Authentication

```bash
# Wrong credentials - should fail with 401
pnpm decent:upload shot.json --email wrong@email.com --secret wrong-key
```

### 4. Test Dual-Write Mode

```bash
# Terminal 1: Enable dual-write
psql $DATABASE_URL -c "UPDATE feature_flags SET enabled = true WHERE name IN ('write_to_postgres', 'write_to_firestore');"

# Terminal 2: Upload via Firebase Function
pnpm decent:upload shot.json --url http://127.0.0.1:5001/brewlog-dev/europe-west2/decentUpload

# Verify shot in both databases
# PostgreSQL:
psql $DATABASE_URL -c "SELECT id, fb_id, profile_name, from_decent FROM espresso WHERE from_decent = true ORDER BY uploaded_at DESC LIMIT 1;"

# Firestore: Check Firebase Console
```

## Development Workflow

### Test Local Endpoint

```bash
# Terminal 1: Start dev server
pnpm dev

# Terminal 2: Upload test shot
pnpm decent:upload src/__tests__/fixtures/decent-shots/20230427T143835.json
```

### Test with Emulators

```bash
# Terminal 1: Start Firebase emulators
pnpm emulators:start

# Terminal 2: Start dev server
pnpm dev

# Terminal 3: Test Firebase Function
pnpm decent:upload shot.json --url http://127.0.0.1:5001/brewlog-dev/europe-west2/decentUpload
```

## Troubleshooting

| Error | Solution |
|-------|----------|
| `Email required` | Set `DECENT_EMAIL` env var or use `--email` |
| `Secret key required` | Set `DECENT_SECRET_KEY` env var or use `--secret` |
| `ECONNREFUSED` | Server not running - start with `pnpm dev` |
| `401 Unauthorized` | Check email/secret key are correct |
| `409 Conflict` | Shot already uploaded (duplicate detection working) |
| `500 Internal Server Error` | Check server logs for details |

## Available Test Shots

All located in `src/__tests__/fixtures/decent-shots/`:

- `20230427T143835.json` / `.shot` - Standard shot (~18s)
- `20230429T165034.json` / `.shot` - Shorter shot (~6s)

## Tips

1. **First time setup**: Get your secret key from Settings page (`/settings`)
2. **Avoid duplicates**: Use different shot files or delete existing shots
3. **Check server logs**: Look for detailed error messages in terminal
4. **Verify in database**: Query PostgreSQL or check Firebase Console
5. **Test both endpoints**: TanStack (`/api/decent-shots`) and Firebase Function

## Advanced: Manual Testing with curl

```bash
# Encode credentials
AUTH=$(echo -n "email:secret" | base64)

# Upload JSON shot
curl -X POST http://localhost:3000/api/decent-shots \
  -H "Authorization: Basic $AUTH" \
  -F "file=@shot.json;type=application/json"

# Upload TCL shot
curl -X POST http://localhost:3000/api/decent-shots \
  -H "Authorization: Basic $AUTH" \
  -F "file=@shot.shot;type=application/octet-stream"
```

## Next Steps

After verifying local testing works:

1. Deploy to staging/production
2. Test with actual Decent machine uploads
3. Verify dual-write behavior with real shots
4. Monitor both databases for consistency
5. Gradually transition through migration phases

See `DECENT_MIGRATION.md` for full migration guide.
