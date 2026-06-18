const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');

const execPromise = util.promisify(exec);
const BACKUP_PATH = path.resolve('e:/projects/project-hub/backups/db');

/**
 * Core logic to perform the database backup.
 */
const performBackup = async (io) => {
  // Ensure backup directory exists
  if (!fs.existsSync(BACKUP_PATH)) {
    fs.mkdirSync(BACKUP_PATH, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const folderName = `backup-${timestamp}`;
  const backupFolderPath = path.join(BACKUP_PATH, folderName);
  const archivePath = `${backupFolderPath}.tar.gz`;
  
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/project-hub';
  
  console.log(`[Backup Service] Starting backup at ${new Date().toLocaleString()}...`);

  try {
    // 1. Run mongodump
    await execPromise(`mongodump --uri="${mongoUri}" --out="${backupFolderPath}"`);
    
    // 2. Compress folder to .tar.gz
    await execPromise(`tar -czvf "${archivePath}" -C "${BACKUP_PATH}" "${folderName}"`);

    // 3. Remove raw folder
    fs.rmSync(backupFolderPath, { recursive: true, force: true });

    console.log(`[Backup Service] Success: Backup created at ${archivePath}`);

    // 4. Retention Policy: Delete backups older than 7 days
    const files = fs.readdirSync(BACKUP_PATH);
    const now = Date.now();
    const expiry = 7 * 24 * 60 * 60 * 1000;

    files.forEach(file => {
      const filePath = path.join(BACKUP_PATH, file);
      if (file.endsWith('.tar.gz')) {
        const stats = fs.statSync(filePath);
        if (now - stats.mtimeMs > expiry) {
          fs.unlinkSync(filePath);
        }
      }
    });

    // 5. Notify UI via Socket.io if available
    if (io) {
      io.emit('DB_BACKUP_READY', { filename: `${folderName}.tar.gz` });
    }

    return { success: true, filename: `${folderName}.tar.gz` };
  } catch (error) {
    console.error(`[Backup Service] Failed: ${error.message}`);
    throw error;
  }
};

/**
 * Schedules a daily database backup at midnight.
 * Requirements: 'mongodump' must be installed on the system path.
 */
const initBackupSchedule = (io) => {
  // Schedule to run every day at 00:00 (Midnight)
  cron.schedule('0 0 * * *', () => performBackup(io));
};

module.exports = { 
  initBackupSchedule,
  performBackup,
  BACKUP_PATH 
};