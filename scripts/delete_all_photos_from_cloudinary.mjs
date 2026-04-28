import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

async function deleteAllOfType(resourceType) {
  let deleted = 0;
  let nextCursor = null;

  do {
    const params = { resource_type: resourceType, max_results: 500 };
    if (nextCursor) params.next_cursor = nextCursor;

    const response = await cloudinary.api.resources(params);
    const publicIds = response.resources.map((r) => r.public_id);

    if (publicIds.length === 0) break;

    // Delete in batches of 100 (Cloudinary limit)
    for (let i = 0; i < publicIds.length; i += 100) {
      const batch = publicIds.slice(i, i + 100);
      await cloudinary.api.delete_resources(batch, { resource_type: resourceType });
      deleted += batch.length;
      process.stdout.write(`\r  Deleted ${deleted} ${resourceType}(s)...`);
    }

    nextCursor = response.next_cursor;
  } while (nextCursor);

  console.log(`\r  Deleted ${deleted} ${resourceType}(s) total.`);
  return deleted;
}

async function deleteAll() {
  console.log("Deleting all assets from Cloudinary...\n");

  let total = 0;
  for (const type of ["image", "video", "raw"]) {
    console.log(`Deleting ${type}s...`);
    total += await deleteAllOfType(type);
  }

  console.log(`\nDone. ${total} total assets deleted.`);
}

deleteAll();
