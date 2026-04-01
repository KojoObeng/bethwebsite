'use client';

import { useState } from 'react';
import PdfViewer from './PdfViewer';
import PdfThumbnail from './PdfThumbnail';

export interface PdfItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  externalUrl?: boolean;
  coverImage?: string;
  year?: string;
  description?: string;
}

interface PdfGridProps {
  items: PdfItem[];
  emptyMessage?: string;
}

function CollapsibleDescription({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-1">
      <p className="text-[#5A4030] text-base leading-relaxed" style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}>
        {open ? text : text.slice(0, 120) + (text.length > 120 ? '…' : '')}
      </p>
      {text.length > 120 && (
        <button
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); setOpen((o) => !o); }}
          className="text-[0.6rem] tracking-[0.15em] uppercase text-[#9B7320] hover:text-[#234D38] transition-colors mt-1"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          {open ? 'Show less ▲' : 'Read more ▼'}
        </button>
      )}
    </div>
  );
}

export default function PdfGrid({ items, emptyMessage = 'No items available yet.' }: PdfGridProps) {
  const [active, setActive] = useState<PdfItem | null>(null);

  if (items.length === 0) {
    return (
      <p className="text-center text-[#7A6545] italic py-16 text-lg" style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 items-start">
        {items.map((item) => item.externalUrl ? (
          <div key={item.id} className="pdf-card text-left group bg-[#FBF7EE] border border-[#C8B896] rounded-sm p-3 flex flex-col gap-3" style={{ boxShadow: '0 2px 8px rgba(44,28,14,0.06)' }}>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-3 flex-1">
              <div className="w-full aspect-[3/4] overflow-hidden rounded-sm border border-[#E8DCC5] bg-[#234D38]">
                {item.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[#C8A200] text-4xl">◎</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-0.5 px-1">
                <p className="text-[#234D38] text-lg font-semibold leading-tight group-hover:text-[#9B7320] transition-colors" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {item.title}
                </p>
                {item.subtitle && <p className="text-[#7A6545] text-xs italic leading-snug" style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}>{item.subtitle}</p>}
              </div>
              <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[#9B7320] group-hover:text-[#234D38] transition-colors mt-auto px-1 pb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                Visit Site &rarr;
              </span>
            </a>
            {item.description && <CollapsibleDescription text={item.description} />}
          </div>
        ) : (
          <div key={item.id} className="pdf-card text-left group bg-[#FBF7EE] border border-[#C8B896] rounded-sm p-3 flex flex-col gap-3" style={{ boxShadow: '0 2px 8px rgba(44,28,14,0.06)' }}>
            <button onClick={() => setActive(item)} className="flex flex-col gap-3 text-left">
              <div className="w-full aspect-[3/4] overflow-hidden rounded-sm border border-[#E8DCC5] bg-[#E8DCC5]">
                <PdfThumbnail url={item.url} />
              </div>
              <div className="flex flex-col gap-0.5 px-1">
                <p className="text-[#234D38] text-lg font-semibold leading-tight group-hover:text-[#9B7320] transition-colors" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="text-[#7A6545] text-xs italic leading-snug" style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}>
                    {item.subtitle}
                  </p>
                )}
                {item.year && (
                  <p className="text-[#9B7320] text-xs tracking-wider mt-0.5" style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}>
                    {item.year}
                  </p>
                )}
              </div>
              <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[#9B7320] group-hover:text-[#234D38] transition-colors px-1 pb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                Read &rarr;
              </span>
            </button>
            {item.description && <CollapsibleDescription text={item.description} />}
          </div>
        ))}
      </div>

      {active && (
        <PdfViewer url={active.url} title={active.title} onClose={() => setActive(null)} />
      )}
    </>
  );
}
