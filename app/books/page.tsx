import { list } from '@vercel/blob';
import { unstable_cache } from 'next/cache';
import PdfGrid, { PdfItem } from '../components/PdfGrid';

// Title overrides keyed by a substring of the filename (case-insensitive)
const TITLE_OVERRIDES: Record<string, string> = {
  'sugar minott': 'Legend of Youth Promotion - Sugar Minott',
};

// Descriptions keyed by a substring of the filename (case-insensitive)
const DESCRIPTIONS: Record<string, string> = {
  'sugar minott': `The Legend of Sugar Minott and Youth Promotion is both a biography of the legendary Jamaican vocalist and a history of the sound system, Youth Promotion. Writing his tribute to the reggae Don Sugar Minott was a labor of love for Beth Lesser. She and her husband, David Kingston, were married at Sugar's home in 1986, at a Youth Promotion dance. When Sugar passed away, Beth realized the importance of keeping his memory alive. Although his music speaks for itself, people might not be aware of all the good he did in his quest to give guidance and support to the youth in the ghetto. Or how much he gave to reggae by discovering and nurturing such artists as Little John, Tristan Palma, Tenorsaw, Junior Reid, Garnett Silk, and many others. Sugar Minott spent his life helping talented youth get ahead in the business. A huge influence on the course of modern reggae, Sugar Minott is a true legend in Jamaican music. This special Muzik Tree edition features many never before published photographs.`,
  'rubadubstyle': `Rubadub Style: The Roots of Modern Dancehall (2012). In the early 1980s, when Dancehall hit the record markets abroad, many long time reggae enthusiasts were disheartened. Fans had been comfortable with roots music – Burning Spear, Bob Marley, Yabby You, Augustus Pablo, Culture. But the mood in Jamaica had changed. The new decade saw a move away from reggae as fans had known it. Many roots artists seemed to fade into the background as young unknowns arose to take their place. When Bob Marley died in 1981, many people felt that reggae had ceased to exist. The new music of the 80s appeared materialistic, often sexually suggestive, sensationalist, focused on the excitement of the moment. A large group of former reggae supporters felt abandoned and moved away from the music. But many more new fans flocked to this exhilarating, provocative, bracing new form of entertainment. Jamaica was reclaiming its music and bringing it back home. After years of artists vying for foreign exposure, reggae was becoming more purely Jamaican than it had ever been in its short history. Dancehall had arrived and was bringing big changes to the musical landscape.`,
  'king jammy': `When Bob Marley passed away in 1981, many fans outside Jamaica assumed that reggae had died with him. But as Beth Lesser's intimate tour into the heart of reggae reveals, this couldn't have been farther from the truth. Ghetto-based sound systems rocked local dancehalls and gave birth to a new golden age of Jamaican music. The '80s was the age of dancehall and Lloyd 'Jammy' James was King. Having begun his musical career as an apprentice to King Tubby – the legendary producer credited with inventing dub music – Jammy soon moved out on his own to build a musical empire. Propelled by a fresh approach and a willingness to experiment with new ideas, King Jammy's sound system ruled the dancehall for much of the '80s, as his labels turned out one innovative hit after another, forever changing the sound of reggae music. In this reissue of the classic book first published by Blackstar Press in 1989, Beth Lesser provides an insider's account of the crowning of King Jammy. With an achingly beautiful new design and a treasure chest of rare photos, Lesser's affectionate narrative offers a rare glimpse into the lives of the artists, engineers, deejays, selectors, gatemen, and ghetto-dwellers who played a part in the making of this musical legend.`,
};

function descriptionForTitle(title: string): string | undefined {
  // Normalize hyphens and underscores to spaces before matching
  const lower = title.toLowerCase().replace(/[-_]/g, ' ');
  for (const [key, desc] of Object.entries(DESCRIPTIONS)) {
    if (lower.includes(key)) return desc;
  }
  return undefined;
}

function titleFromPathname(pathname: string): string {
  console.log(pathname);
  const filename = pathname.split('/').pop() ?? pathname;
  const derived = decodeURIComponent(filename.replace(/\.pdf$/i, '').replace(/_/g, ' '));
  const lower = derived.toLowerCase().replace(/[-_]/g, ' ');
  for (const [key, override] of Object.entries(TITLE_OVERRIDES)) {
    if (lower.includes(key)) return override;
  }
  return derived;
}

const getBooksItems = unstable_cache(
  async (): Promise<PdfItem[]> => {
    const { blobs } = await list({ prefix: 'Books/' });
    const thumbMap = new Map(
      blobs
        .filter((b) => /\.(jpg|jpeg|png|webp)$/i.test(b.pathname))
        .map((b) => [b.pathname.replace(/\.[^.]+$/, '').toLowerCase(), b.url])
    );
    return blobs
      .filter((b) => b.pathname.toLowerCase().endsWith('.pdf'))
      .map((b) => {
        const title = titleFromPathname(b.pathname);
        const stem = b.pathname.replace(/\.pdf$/i, '').toLowerCase();
        return {
          id: b.pathname,
          title,
          url: b.url,
          thumbnailUrl: thumbMap.get(stem),
          description: descriptionForTitle(title),
        };
      });
  },
  ['books-blobs'],
  { revalidate: 3600 }
);

const SOUL_JAZZ_BOOK: PdfItem = {
  id: 'soul-jazz-dancehall',
  title: 'Dancehall: The Rise of Jamaican Dancehall Culture',
  subtitle: 'Soul Jazz Records',
  url: 'https://soundsoftheuniverse.com/sjr/product/dancehall-book-the-rise-of-jamaican-dancehall-culture',
  externalUrl: true,
  coverImage: '/RiseOfDancehallCulture.jpg',
  description: `(Only available through Soul Jazz Records and outlets)\n\n"How the world tuned into Jamaica: The sounds of Kingston's dancehall craze revolutionized music and shaped the hits we listen to today" — Rob Nash, The Sunday Times, UK, November 2, 2008\n\nLesser first visited Kingston in 1981 as a wide-eyed 28-year-old Canadian reggae fan. She found the big new thing, the scene everyone wanted to be involved in, was dancehall. She spent most of the decade travelling to Jamaica and back. The 1980s are seen as the golden age of dancehall, when the serious political messages of Rastafarianism gave way to a boisterous music that drew the whole community into the party. At sound clashes, rival sound systems would unleash their most powerful weapons against each other: the latest dubplates, the most experienced selectors, and perhaps a hot new DJ with a fine line in bawdy patter. Lesser found the people who were making this music more than willing to be photographed. "What made a big impression on my first visit was that everything was so accessible," she recalls. Dancehall book available in book stores, art galleries, on-line and from Soul Jazz Records.`,
};

export default async function BooksPage() {
  let items: PdfItem[] = [];
  try {
    items = await getBooksItems();
  } catch (err) {
    console.error('Failed to list Books blobs:', err);
  }

  // Prepend the Soul Jazz book (no PDF — external link)
  items = [SOUL_JAZZ_BOOK, ...items];

  return (
    <div>
      <div className="mb-10">
        <h2
          className="text-3xl text-[#234D38] font-normal mb-3"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Books
        </h2>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-[#C4A55A]" />
          <span
            className="text-xs tracking-[0.25em] uppercase text-[#9B7320]"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Reading Room
          </span>
        </div>
        <p
          className="text-[#7A6545] text-base max-w-xl leading-relaxed"
          style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}
        >
          A curated library of books on reggae, Jamaican culture, and the music
          that shaped a generation.{' '}
          <strong className="text-[#234D38]">Every book is free to read in full</strong>{' '}
          — no account or purchase required. Just click to open.
        </p>
      </div>

      <PdfGrid items={items} emptyMessage="Books coming soon." />
    </div>
  );
}
