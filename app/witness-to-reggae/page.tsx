'use client';

import { useState } from 'react';

const ENGLISH_PDF = '/Witness to Reggae.pdf';
const UKRAINIAN_PDF = '/Witness to Reggae (Ukrainian).pdf';

export default function WitnessToReggaePage() {
  const [lang, setLang] = useState<'en' | 'uk'>('en');
  const pdfUrl = lang === 'en' ? ENGLISH_PDF : UKRAINIAN_PDF;

  return (
    <div>
      {/* Section header */}
      <div className="mb-8">
        <h2
          className="text-3xl text-[#234D38] font-normal mb-3"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Witness to Reggae
        </h2>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-12 bg-[#C4A55A]" />
          <span
            className="text-xs tracking-[0.25em] uppercase text-[#9B7320]"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            By Beth Lesser
          </span>
        </div>

        {/* Ukrainian translation note */}
        <div
          className="text-[#5A4030] text-base max-w-2xl space-y-3 leading-relaxed mb-6"
          style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}
        >
          <p>
            Nazar lives in the Ukraine, near Kiev, and spins tropical music in clubs. Since the
            start of the war with Russia, club dates have become scarce. To keep connected to the
            music he loves, Nazar decided to do some translation work instead. Nazar hopes that his
            work here will help people on his side of the world understand more about reggae, and
            music in the Caribbean, and learn to listen with an open ear and a sincere heart.
          </p>
        </div>

        {/* Language toggle */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className="text-xs tracking-[0.2em] uppercase text-[#9B7320]"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Viewing:
          </span>
          <button
            onClick={() => setLang('en')}
            className={`px-4 py-1.5 text-xs tracking-[0.15em] uppercase border transition-colors ${
              lang === 'en'
                ? 'bg-[#234D38] text-[#E8CC7A] border-[#234D38]'
                : 'text-[#9B7320] border-[#C4A55A] hover:border-[#234D38] hover:text-[#234D38]'
            }`}
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            English
          </button>
          <button
            onClick={() => setLang('uk')}
            className={`px-4 py-1.5 text-xs tracking-[0.15em] uppercase border transition-colors ${
              lang === 'uk'
                ? 'bg-[#234D38] text-[#E8CC7A] border-[#234D38]'
                : 'text-[#9B7320] border-[#C4A55A] hover:border-[#234D38] hover:text-[#234D38]'
            }`}
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Ukrainian
          </button>
        </div>
      </div>

      {/* Inline PDF viewer — hidden on mobile, replaced by direct link */}
      <div className="hidden sm:block w-full border border-[#C8B896] rounded-sm overflow-hidden" style={{ height: '80vh' }}>
        <iframe
          key={pdfUrl}
          src={pdfUrl}
          title={`Witness to Reggae — ${lang === 'en' ? 'English' : 'Ukrainian'}`}
          className="w-full h-full"
          style={{ border: 'none' }}
        />
      </div>

      {/* On mobile: just a direct open link */}
      <a
        href={pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="sm:hidden inline-block px-6 py-3 bg-[#234D38] text-[#E8CC7A] text-sm tracking-[0.2em] uppercase border border-[#C8A200]/40 hover:bg-[#C8A200] hover:text-[#163320] transition-colors"
        style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
      >
        Open PDF &rarr;
      </a>

      {/* Desktop fallback link */}
      <p
        className="hidden sm:block mt-4 text-[#7A6545] text-sm"
        style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}
      >
        If the PDF does not load,{' '}
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#9B7320] underline hover:text-[#234D38] transition-colors"
        >
          open it directly
        </a>
        .
      </p>
    </div>
  );
}
