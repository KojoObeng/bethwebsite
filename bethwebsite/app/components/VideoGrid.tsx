'use client';

import { useState } from 'react';

export interface CloudinaryVideo {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  duration?: number;
  format: string;
}

function posterUrl(video: CloudinaryVideo): string {
  // Cloudinary auto-generates a JPEG poster from the video's first frame
  return video.secure_url
    .replace('/video/upload/', '/video/upload/f_jpg,q_auto:good,w_400,so_0/')
    .replace(/\.[^.]+$/, '.jpg');
}

function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function VideoLabel({ public_id }: { public_id: string }) {
  const name = public_id.split('/').pop()?.replace(/_/g, ' ') ?? '';
  return <>{name}</>;
}

interface LightboxProps {
  video: CloudinaryVideo;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

function VideoLightbox({ video, onClose, onPrev, onNext, hasPrev, hasNext }: LightboxProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex flex-col"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 flex-shrink-0 bg-black/40">
        <span
          className="text-[#C4A55A] text-xs tracking-[0.2em] uppercase truncate max-w-[60%]"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          <VideoLabel public_id={video.public_id} />
        </span>
        <button
          onClick={onClose}
          className="text-[#C4A55A] hover:text-white text-2xl leading-none transition-colors"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      {/* Video area */}
      <div className="flex-1 flex items-center justify-center relative px-12 py-4">
        {hasPrev && (
          <button
            onClick={onPrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-[#C4A55A] hover:text-white text-4xl transition-colors z-10 px-2"
            aria-label="Previous"
          >
            ‹
          </button>
        )}
        <video
          key={video.secure_url}
          controls
          autoPlay
          className="max-w-full max-h-[calc(100vh-120px)] rounded-sm"
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        >
          <source src={video.secure_url} type={`video/${video.format}`} />
        </video>
        {hasNext && (
          <button
            onClick={onNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-[#C4A55A] hover:text-white text-4xl transition-colors z-10 px-2"
            aria-label="Next"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}

export default function VideoGrid({ videos }: { videos: CloudinaryVideo[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((video, i) => (
          <button
            key={video.public_id}
            onClick={() => setLightboxIndex(i)}
            className="group relative overflow-hidden bg-[#0D1C0F] border border-[#C8B896] rounded-sm cursor-pointer text-left"
            style={{ boxShadow: '0 2px 12px rgba(10,20,9,0.2)' }}
          >
            {/* Poster image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterUrl(video)}
              alt={video.public_id.split('/').pop() ?? 'video'}
              className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />

            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors duration-200">
              <div className="w-14 h-14 rounded-full bg-[#C8A200]/80 group-hover:bg-[#C8A200] flex items-center justify-center transition-colors duration-200">
                <span className="text-[#163320] text-2xl leading-none pl-1">▶</span>
              </div>
            </div>

            {/* Duration badge */}
            {video.duration && (
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                {formatDuration(video.duration)}
              </span>
            )}

            {/* Title bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-3 pt-8">
              <p
                className="text-[#E8CC7A] text-xs tracking-wide truncate"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                <VideoLabel public_id={video.public_id} />
              </p>
            </div>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <VideoLightbox
          video={videos[lightboxIndex]}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
          onNext={() => setLightboxIndex((i) => (i !== null && i < videos.length - 1 ? i + 1 : i))}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < videos.length - 1}
        />
      )}
    </>
  );
}
