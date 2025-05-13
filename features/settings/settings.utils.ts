import { getFullPublicAssetPath, writeStringToFile } from "@/lib/server-utils";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
export const saveLogo = async ({ content }: { content: string }) => {
  const fileName = "logo.svg";
  const path = await writeStringToFile({ content, fileName });
  const input = getFullPublicAssetPath(fileName);
  const output = input.replace(fileName, "favicon.ico");

  try {
    await execAsync(
      `magick -background none ${input} -define icon:auto-resize=64,48,32,16 ${output}`,
    );
  } catch (err) {
    console.error("❌ Convert failed:", err);
  }
  return path;
};
