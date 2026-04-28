import { v2 as cloudinary } from 'cloudinary';
import { unstable_cache } from 'next/cache';
import PhotoGallery from '../components/PhotoGallery';

cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
  secure: true,
});

export interface FolderMeta {
  name: string;
  previewUrl: string | null;
}

const getFolderMeta = unstable_cache(async (): Promise<FolderMeta[]> => {
  // 1. Get the authoritative folder list from Cloudinary
  const { folders } = await cloudinary.api.root_folders();
  const folderNames: string[] = (folders ?? [])
    .map((f: { name: string }) => f.name)
    .sort((a: string, b: string) => a.localeCompare(b));

  // 2. Fetch one preview per folder (image preferred, video fallback) in parallel
  const results = await Promise.all(
    folderNames.map(async (name) => {
      try {
        const [imgRes, vidRes] = await Promise.all([
          cloudinary.api.resources({ type: 'upload', resource_type: 'image', prefix: name + '/', max_results: 1 }),
          cloudinary.api.resources({ type: 'upload', resource_type: 'video', prefix: name + '/', max_results: 1 }),
        ]);

        const firstImg = imgRes.resources?.[0];
        const firstVid = vidRes.resources?.[0];

        let previewUrl: string | null = null;
        if (firstImg) {
          previewUrl = (firstImg.secure_url as string).replace(
            '/upload/',
            '/upload/f_auto,q_auto:good,w_200,h_200,c_fill,g_auto/'
          );
        } else if (firstVid) {
          // Use Cloudinary's auto-generated video poster (first frame as JPEG)
          previewUrl = (firstVid.secure_url as string)
            .replace('/video/upload/', '/video/upload/f_jpg,q_auto:good,w_200,h_200,c_fill,g_auto,so_0/')
            .replace(/\.[^.]+$/, '.jpg');
        }

        return { name, previewUrl };
      } catch {
        return { name, previewUrl: null };
      }
    })
  );

  return results;
}, ['cloudinary-folder-meta'], { revalidate: 3600 });

export default async function PhotographsPage() {
  let folders: FolderMeta[] = [];
  try {
    folders = await getFolderMeta();
  } catch (err) {
    console.error('Failed to load folder metadata:', err);
  }

  return (
    <div>
      <div className="mb-10">
        <h2
          className="text-3xl text-[#234D38] font-normal mb-3"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Photographs
        </h2>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-[#C4A55A]" />
          <span
            className="text-xs tracking-[0.25em] uppercase text-[#9B7320]"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Jamaica &amp; Beyond
          </span>
        </div>
        <div
          className="text-[#5A4030] text-base max-w-2xl space-y-4 leading-relaxed"
          style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}
        >
          <p>
            The photographs that appear on these pages were taken between 1982 and 1988.
            The color images from 1982 were taken by David Kingston with an Instamatic camera.
            The rest were taken by Beth Lesser with a Nikon F2 using Fuji 400 film,
            Tri X black and white or Kodak slide film.
          </p>
        </div>
      </div>

      <div id="gallery">
        <PhotoGallery folders={folders} />
      </div>
    </div>
  );
}
