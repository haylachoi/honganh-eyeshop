import {
  getFullPublicAssetPath,
  writeFileToDisk,
  writeStringToFile,
} from "@/lib/server-utils";
import { exec } from "child_process";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

export const saveIcon = async ({
  content,
  fileName,
  to = "/icons",
}: {
  content: string;
  fileName: string;
  to?: "/icons";
}) => {
  const path = await writeStringToFile({ content, fileName, to });

  return path;
};

export const saveLogo = async ({ file }: { file: File }) => {
  const fileName = "logo.svg";

  const input = getFullPublicAssetPath(fileName);
  await writeFileToDisk({ file, fullFilePath: input });
  const output = input.replace(fileName, "favicon.ico");

  try {
    await execAsync(
      `magick -background none ${input} -define icon:auto-resize=64,48,32,16 ${output}`,
    );
  } catch (err) {
    console.error("❌ Convert failed:", err);
  }

  return path.join("/", fileName);
};
