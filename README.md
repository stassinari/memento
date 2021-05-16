# Memento

## Backup and restore

Install this library: https://github.com/willhlaw/node-firestore-backup-restore

Keep in mind that a subcollection of a document with no fields will _not_ backup.

Backup prod:

```
# Prod
firestore-backup-restore -a scripts/serviceAccountKeyPROD.json -B backups/prod -P

# Dev
firestore-backup-restore -a scripts/serviceAccountKeyDEV.json -B backups/dev -P
```

Now that everything sits inside the `users` collection, it's easy to move things around between DEV and PRD.

Restore in dev:

```
firestore-backup-restore --backupPath backups/dev --restoreAccountCredentials scripts/serviceAccountKeyDEV.json
```
