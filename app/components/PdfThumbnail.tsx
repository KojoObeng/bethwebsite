'use client';

import { useEffect, useRef, useState } from 'react';
import { getPdfJs, enqueueRender } from '../../lib/pdfjs';

interface PdfThumbnailProps {
  url: string;
}

export default function PdfThumbnail({ url }: PdfThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const queued = useRef(false);

  // Kick off rendering once the card scrolls into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !queued.current) {
          queued.current = true;
          observer.disconnect();
          // Pre-warm the PDF.js singleton as soon as the card is visible,
          // so the worker is ready when our turn in the queue arrives
          getPdfJs();
          setStatus('loading');
          enqueueRender(renderPage);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [url]); // eslint-disable-line react-hooks/exhaustive-deps

  async function renderPage(): Promise<void> {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    try {
      const pdfjsLib = await getPdfJs();
      const pdf = await pdfjsLib.getDocument(url).promise;
      const page = await pdf.getPage(1);

      const baseViewport = page.getViewport({ scale: 1 });
      const scale = (container.clientWidth || 200) / baseViewport.width;
      const viewport = page.getViewport({ scale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = '100%';

      await page.render({ canvas, viewport }).promise;
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div ref={containerRef} className="w-full h-full relative bg-[#E8DCC5]">
      {/* Shimmer while queued / loading */}
      {(status === 'idle' || status === 'loading') && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8DCC5] to-[#D4C4A8] animate-pulse" />
      )}

      {/* Error fallback */}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#234D38]/10">
          <svg viewBox="0 0 64 80" className="w-12 h-12 opacity-30" fill="none">
            <rect x="8" y="4" width="48" height="72" rx="3" fill="#E8DCC5" stroke="#C8B896" strokeWidth="1.5" />
            <rect x="8" y="4" width="8" height="72" rx="2" fill="#C4A55A" opacity="0.5" />
          </svg>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className={`w-full transition-opacity duration-300 ${
          status === 'done' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
