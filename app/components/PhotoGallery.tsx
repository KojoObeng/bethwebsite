'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import VideoGrid, { CloudinaryVideo } from './VideoGrid';
import type { FolderMeta } from '../photographs/page';

// Cloudinary URL transforms
function thumbUrl(url: string): string {
  return url.replace('/upload/', '/upload/f_auto,q_auto:good,w_400,c_fill,g_auto/');
}
function fullUrl(url: string): string {
  return url.replace('/upload/', '/upload/f_auto,q_auto/');
}

export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

export interface CloudinaryFolder {
  name: string;
  path: string;
  images: CloudinaryImage[];
  videos: CloudinaryVideo[];
}

// Module-level cache — persists for the lifetime of the browser session
const folderCache = new Map<string, { images: CloudinaryImage[]; videos: CloudinaryVideo[] }>();

// ── Lightbox ──────────────────────────────────────────────────────────────────

interface LightboxProps {
  image: CloudinaryImage;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  prevImage?: CloudinaryImage;
  nextImage?: CloudinaryImage;
}

function Lightbox({ image, onClose, onPrev, onNext, hasPrev, hasNext, prevImage, nextImage }: LightboxProps) {
  // Preload adjacent images so next/prev clicks are instant
  useEffect(() => {
    if (prevImage) { const img = new window.Image(); img.src = fullUrl(prevImage.secure_url); }
    if (nextImage) { const img = new window.Image(); img.src = fullUrl(nextImage.secure_url); }
  }, [prevImage, nextImage]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex flex-col"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-6 py-3 flex-shrink-0 bg-black/40" onClick={(e) => e.stopPropagation()}>
        <span
          className="text-[#C4A55A] text-xs tracking-[0.2em] uppercase truncate max-w-[60%]"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          {image.public_id.split('/').pop()?.replace(/_/g, ' ') ?? ''}
        </span>
        <button onClick={onClose} className="text-[#C4A55A] hover:text-white text-2xl leading-none transition-colors" aria-label="Close">
          &times;
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center relative px-12 py-4">
        {hasPrev && (
          <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-[#C4A55A] hover:text-white text-4xl transition-colors z-10 px-2" aria-label="Previous">‹</button>
        )}
        <Image
          src={fullUrl(image.secure_url)}
          alt={image.public_id}
          width={image.width}
          height={image.height}
          className="object-contain max-h-[calc(100vh-120px)] w-auto"
          style={{ maxHeight: 'calc(100vh - 120px)' }}
          onClick={(e) => e.stopPropagation()}
          priority
        />
        {hasNext && (
          <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-[#C4A55A] hover:text-white text-4xl transition-colors z-10 px-2" aria-label="Next">›</button>
        )}
      </div>
    </div>
  );
}

// ── Image grid ────────────────────────────────────────────────────────────────

function ImageGrid({ images }: { images: CloudinaryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((img, i) => (
          <button
            key={img.public_id}
            onClick={() => setLightboxIndex(i)}
            className="group relative aspect-square overflow-hidden bg-[#E8DCC5] border border-[#C8B896] rounded-sm"
          >
            <Image
              src={thumbUrl(img.secure_url)}
              alt={img.public_id.split('/').pop() ?? 'photograph'}
              fill
              className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB2aWV3Qm94PSIwIDAgNCA0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNFOERDQzUiLz48L3N2Zz4="
            />
          </button>
        ))}
      </div>
      {lightboxIndex !== null && (
        <Lightbox
          image={images[lightboxIndex]}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
          onNext={() => setLightboxIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : i))}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < images.length - 1}
          prevImage={lightboxIndex > 0 ? images[lightboxIndex - 1] : undefined}
          nextImage={lightboxIndex < images.length - 1 ? images[lightboxIndex + 1] : undefined}
        />
      )}
    </>
  );
}

// ── Folder section (lazy loads on expand, caches forever) ─────────────────────

function FolderSection({ folder }: { folder: FolderMeta }) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLButtonElement>(null);

  function collapse() {
    setOpen(false);
    setTimeout(() => {
      if (headerRef.current) {
        const top = headerRef.current.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 0);
  }
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ images: CloudinaryImage[]; videos: CloudinaryVideo[] } | null>(
    folderCache.get(folder.name) ?? null
  );

  const loadedTotal = data ? data.images.length + data.videos.length : null;

  async function handleOpen() {
    const next = !open;
    setOpen(next);
    if (next && !data) {
      setLoading(true);
      try {
        const res = await fetch(`/api/folder/${encodeURIComponent(folder.name)}`);
        const json = await res.json();
        folderCache.set(folder.name, json);
        setData(json);
      } catch {
        setData({ images: [], videos: [] });
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <section className="border border-[#E8DCC5] rounded-sm">
      {/* Header */}
      <button
        ref={headerRef}
        onClick={handleOpen}
        className="w-full flex items-center gap-4 px-4 py-3 bg-[#F0E8D5] hover:bg-[#EAE0C8] transition-colors text-left"
      >
        {/* Preview thumbnail */}
        <div className="flex-shrink-0 w-16 h-16 rounded-sm overflow-hidden bg-[#E8DCC5] border border-[#C8B896]">
          {folder.previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={folder.previewUrl} alt={folder.name} className="w-full h-full object-contain object-center" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#C4A55A] text-xl">▶</div>
          )}
        </div>

        <h3
          className="text-2xl text-[#234D38] font-normal flex-1"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          {folder.name}
        </h3>
        {loadedTotal !== null && (
          <span
            className="text-[#9B7320] text-xl italic"
            style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}
          >
            {loadedTotal} item{loadedTotal !== 1 ? 's' : ''}
          </span>
        )}
        <span className="text-[#C8A200] text-lg leading-none ml-2">
          {open ? '▲' : '▼'}
        </span>
      </button>

      {/* Content */}
      {open && (
        <div className="flex gap-0">
          {/* Full-height collapse tab on the left */}
          <div
            onClick={collapse}
            role="button"
            aria-label={`Collapse ${folder.name}`}
            title={`Collapse ${folder.name}`}
            className="flex-shrink-0 w-14 bg-[#163320] hover:bg-[#C8A200] transition-colors duration-200 border-r-2 border-[#C8A200] group cursor-pointer"
          >
            <div className="sticky top-[40vh] flex flex-col items-center gap-3 py-4">
              <span className="text-[#C8A200] group-hover:text-[#163320] text-2xl leading-none transition-colors">▲</span>
              <span
                className="text-white group-hover:text-[#163320] text-xs font-bold tracking-[0.2em] uppercase transition-colors"
                style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}
              >
                Collapse
              </span>
            </div>
          </div>

          <div className="flex-1 p-5 pt-6">
          {loading && (
            <p className="text-[#9B7320] italic text-sm py-8 text-center"
               style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}>
              Loading…
            </p>
          )}
          {!loading && data && (
            <>
              <ImageGrid images={data.images} />
              {data.videos.length > 0 && (
                <div className={data.images.length > 0 ? 'mt-6' : ''}>
                  <VideoGrid videos={data.videos} />
                </div>
              )}
              {data.images.length === 0 && data.videos.length === 0 && (
                <p className="text-[#9B7320] italic text-sm py-8 text-center"
                   style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}>
                  No items in this folder.
                </p>
              )}
            </>
          )}
          </div>
        </div>
      )}
    </section>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function PhotoGallery({ folders }: { folders: FolderMeta[] }) {
  const [query, setQuery] = useState('');

  if (folders.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[#7A6545] italic text-lg" style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}>
          No photographs found. Please check your Cloudinary configuration.
        </p>
      </div>
    );
  }

  const filtered = query.trim()
    ? folders.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
    : folders;

  return (
    <div className="flex flex-col gap-4">
      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search folders…"
          className="w-full bg-[#F0E8D5] border border-[#C8B896] rounded-sm px-4 py-2.5 pr-10 text-[#234D38] placeholder-[#5A4030] focus:outline-none focus:border-[#9B7320] text-base"
          style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B7320] hover:text-[#234D38] text-lg leading-none transition-colors"
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-[#9B7320] italic py-10" style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}>
          No folders match &ldquo;{query}&rdquo;
        </p>
      ) : (
        filtered.map((folder) => (
          <FolderSection key={folder.name} folder={folder} />
        ))
      )}
    </div>
  );
}
