import * as fs from 'node:fs';
import * as path from 'node:path';

const directoryPath = path.resolve(__dirname, '../data/raw');

try {
  // Read the contents of the directory synchronously
  const files = fs.readdirSync(directoryPath);
  console.log('files:', files);
} catch (error) {
  console.error('Error reading directory:', error);
}
