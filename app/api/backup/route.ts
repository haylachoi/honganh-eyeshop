import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  backupMongoDB,
  createFullBackup,
  createStaticBackup,
} from "@/features/backup/backup.utils";
import { BACKUUP_TYPE } from "@/features/backup/backup.constants";

function createDownloadResponse(
  fileStream: Buffer<ArrayBufferLike>,
  fileName: string,
) {
  return new NextResponse(fileStream, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename=${fileName}`,
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    const file = url.searchParams.get("file") as string | undefined;
    let archivePath: string = "";

    if (!file) {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }

    if (file === BACKUUP_TYPE.DB) {
      archivePath = await backupMongoDB();
    }
    if (file === BACKUUP_TYPE.STATIC) {
      archivePath = await createStaticBackup();
    }

    if (file === BACKUUP_TYPE.FULL) {
      archivePath = await createFullBackup();
    }

    const fileBuffer = fs.readFileSync(archivePath);
    const filename = path.basename(archivePath);

    return createDownloadResponse(fileBuffer, filename);
  } catch (err) {
    console.error("Backup error:", err);
    return NextResponse.json({ error: "Backup failed" }, { status: 500 });
  }
}
