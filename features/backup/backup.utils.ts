import { DUMP_DIR, MONGO_PASSWORD, MONGO_USER } from "./backup.constants";
import { exec } from "child_process";
import fs from "fs";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);
const backupDir = path.join(process.cwd(), DUMP_DIR);

export function ensureBackupDir() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  return backupDir;
}

function getTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

export async function backupMongoDB(): Promise<string> {
  ensureBackupDir();
  const archivePath = path.join(backupDir, `mongo-${getTimestamp()}.archive`);
  const command = `mongodump --archive=${archivePath} --username=${MONGO_USER} --password=${MONGO_PASSWORD}`;

  await execAsync(command);
  return archivePath;
}

export async function createStaticBackup(): Promise<string> {
  const publicPath = path.join(process.cwd(), "public");
  const tarPath = path.join(backupDir, `static-${getTimestamp()}.tar`);

  if (!fs.existsSync(publicPath)) {
    throw new Error("Public directory not found");
  }

  const command = `tar -cvf ${tarPath} -C ${publicPath} .`;
  await execAsync(command);
  return tarPath;
}

export async function createFullBackup(): Promise<string> {
  ensureBackupDir();
  const timestamp = getTimestamp();

  const mongoBackupPath = await backupMongoDB();
  const staticBackupPath = await createStaticBackup();

  const finalArchivePath = path.join(
    backupDir,
    `full-backup-${timestamp}.tar.gz`,
  );
  const command = `tar -czvf ${finalArchivePath} -C ${backupDir} ${path.basename(mongoBackupPath)} ${path.basename(staticBackupPath)}`;

  await execAsync(command);

  // Dọn file tạm
  fs.unlinkSync(mongoBackupPath);
  fs.unlinkSync(staticBackupPath);

  return finalArchivePath;
}
