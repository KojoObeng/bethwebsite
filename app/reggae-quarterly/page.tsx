import { list } from '@vercel/blob';
import { unstable_cache } from 'next/cache';
import PdfGrid, { PdfItem } from '../components/PdfGrid';

function titleFromPathname(pathname: string): string {
  const filename = pathname.split('/').pop() ?? pathname;
  return decodeURIComponent(filename.replace(/\.pdf$/i, '').replace(/_/g, ' '));
}

const getReggaeQuarterlyItems = unstable_cache(
  async (): Promise<PdfItem[]> => {
    const { blobs } = await list({ prefix: 'Reggae-Quarterly/' });
    const thumbMap = new Map(
      blobs
        .filter((b) => /\.(jpg|jpeg|png|webp)$/i.test(b.pathname))
        .map((b) => [b.pathname.replace(/\.[^.]+$/, '').toLowerCase(), b.url])
    );
    return blobs
      .filter((b) => b.pathname.toLowerCase().endsWith('.pdf'))
      .map((b) => {
        const stem = b.pathname.replace(/\.pdf$/i, '').toLowerCase();
        return {
          id: b.pathname,
          title: titleFromPathname(b.pathname),
          url: b.url,
          thumbnailUrl: thumbMap.get(stem),
        };
      });
  },
  ['reggae-quarterly-blobs'],
  { revalidate: false }
);

export default async function ReggaeQuarterlyPage() {
  let items: PdfItem[] = [];
  try {
    items = await getReggaeQuarterlyItems();
  } catch (err) {
    console.error('Failed to list Reggae Quarterly blobs:', err);
  }

  return (
    <div>
      {/* Section header */}
      <div className="mb-10">
        <h2
          className="text-3xl text-[#234D38] font-normal mb-3"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Reggae Quarterly
        </h2>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-[#C4A55A]" />
          <span
            className="text-xs tracking-[0.25em] uppercase text-[#9B7320]"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Magazine Archive
          </span>
        </div>
        <div
          className="text-[#5A4030] text-base max-w-2xl space-y-4 leading-relaxed"
          style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}
        >
          <p>
            <em>Reggae Quarterly</em> Magazine was published between 1982 and 1988. In 1982, before we
            started working on RQ, we put together a Xeroxed fanzine about producer and melodica player
            Augustus Pablo. We borrowed the name, <em>Live Good Today</em>, from a song sung by Sam Carty
            on the Prince Jazzbo album, <em>Ital Corner</em>. The plan was to bring the &lsquo;Zine to
            Jamaica and show Pablo, which was the purpose of our first visit in 1982.
          </p>
          <p>
            With Pablo&rsquo;s encouragement, we expanded the concept and came out with the{' '}
            <em>Reggae Quarterly</em> magazines presented here.
          </p>
        </div>
      </div>

      <PdfGrid items={items} emptyMessage="Magazine issues coming soon." />
    </div>
  );
}
