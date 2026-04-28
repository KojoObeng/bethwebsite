import { v2 as cloudinary } from 'cloudinary';
import { unstable_cache } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
  secure: true,
});

const getFolderMedia = unstable_cache(
  async (folderName: string) => {
    const prefix = folderName === '(root)' ? undefined : folderName + '/';
    const query = prefix
      ? { type: 'upload', prefix, max_results: 500 }
      : { type: 'upload', max_results: 500 };

    const [imgRes, vidRes] = await Promise.all([
      cloudinary.api.resources({ ...query, resource_type: 'image' }),
      cloudinary.api.resources({ ...query, resource_type: 'video' }),
    ]);

    const images = (imgRes.resources ?? [])
      .filter((r: { public_id: string }) => prefix ? true : !r.public_id.includes('/'))
      .map((r: { public_id: string; secure_url: string; width: number; height: number; format: string }) => ({
        public_id: r.public_id,
        secure_url: r.secure_url,
        width: r.width,
        height: r.height,
        format: r.format,
      }));

    const videos = (vidRes.resources ?? [])
      .filter((r: { public_id: string }) => prefix ? true : !r.public_id.includes('/'))
      .map((r: { public_id: string; secure_url: string; width: number; height: number; format: string; duration?: number }) => ({
        public_id: r.public_id,
        secure_url: r.secure_url,
        width: r.width,
        height: r.height,
        format: r.format,
        duration: r.duration,
      }));

    return { images, videos };
  },
  ['cloudinary-folder'],
  { revalidate: 3600 }
);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const folderName = decodeURIComponent(name);
  try {
    let data = await getFolderMedia(folderName);
    // Cloudinary auto-capitalises folder display names but stores resources
    // under the original lowercase path — retry with lowercase if empty.
    if (data.images.length === 0 && data.videos.length === 0) {
      const lower = folderName.toLowerCase();
      if (lower !== folderName) data = await getFolderMedia(lower);
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error('Folder fetch error:', err);
    return NextResponse.json({ images: [], videos: [] }, { status: 500 });
  }
}
