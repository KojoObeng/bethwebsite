'use client';

import { useEffect } from 'react';

interface PdfViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export default function PdfViewer({ url, title, onClose }: PdfViewerProps) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/70"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal toolbar */}
      <div className="flex items-center justify-between bg-[#234D38] px-6 py-3 flex-shrink-0">
        <h2
          className="text-[#C4A55A] text-sm tracking-widest uppercase truncate max-w-[70%]"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          {title}
        </h2>
        <div className="flex items-center gap-4">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C4A55A] hover:text-white text-xs tracking-widest uppercase border border-[#C4A55A] hover:border-white px-3 py-1 transition-colors"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Open in New Tab
          </a>
          <button
            onClick={onClose}
            className="text-[#C4A55A] hover:text-white text-2xl leading-none transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      </div>

      {/* PDF iframe */}
      <div className="flex-1 bg-[#2C1C0E]">
        <iframe
          src={url}
          title={title}
          className="w-full h-full border-0"
          allow="fullscreen"
        />
      </div>
    </div>
  );
}
