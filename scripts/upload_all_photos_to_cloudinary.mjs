import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Parse .env manually to handle lowercase keys
const envPath = path.join(__dirname, ".env");
const envVars = {};
fs.readFileSync(envPath, "utf8")
  .split(/\r?\n/)
  .forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      envVars[match[1].trim().toUpperCase()] = match[2].trim().replace(/^"|"$/g, "");
    }
  });

cloudinary.config({
  cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
});

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff", ".tif"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".avi", ".mkv", ".wmv", ".flv", ".webm", ".m4v", ".3gp"]);
const ROOT = __dirname;

function getFiles() {
  const results = [];
  for (const folder of fs.readdirSync(ROOT)) {
    const folderPath = path.join(ROOT, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;
    for (const file of fs.readdirSync(folderPath)) {
      const ext = path.extname(file).toLowerCase();
      const resourceType = IMAGE_EXTENSIONS.has(ext) ? "image" : VIDEO_EXTENSIONS.has(ext) ? "video" : null;
      if (!resourceType) continue;
      const baseName = path.basename(file, ext);
      const sanitized = baseName.replace(/&/g, "and").replace(/[()]/g, "").replace(/\s+/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
      results.push({ filePath: path.join(folderPath, file), folder, publicId: sanitized, resourceType });
    }
  }
  return results;
}

async function uploadAll() {
  const files = getFiles();
  console.log(`Found ${files.length} files. Starting upload...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const { filePath, folder, publicId, resourceType } = files[i];
    process.stdout.write(`[${i + 1}/${files.length}] Uploading: ${folder}/${publicId} ... `);
    try {
      await cloudinary.uploader.upload(filePath, {
        folder,
        public_id: publicId,
        overwrite: false,
        resource_type: resourceType,
      });
      console.log("OK");
      success++;
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${success} uploaded, ${failed} failed.`);
}

uploadAll();
