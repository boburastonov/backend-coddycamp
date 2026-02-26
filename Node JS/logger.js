import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logFilePath = path.join(__dirname, 'logs.txt');

export function log(message) {
  const time = new Date().toISOString();
  const line = `${time} - ${message}\n`;

  fs.appendFile(logFilePath, line, (err) => {
    if (err) {
      console.error('Log yozishda xatolik:', err.message);
    }
  });
}

export function readLogs() {
  fs.readFile(logFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Log faylini o‘qib bo‘lmadi:', err.message);
      return;
    }

    console.log('\n===== LOGS =====');
    console.log(data);
  });
}
