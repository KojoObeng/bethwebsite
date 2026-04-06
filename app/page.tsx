import Link from 'next/link';

// King Jammy sound-system truck photo — place the file at public/hero-bg.jpg
const HERO_IMAGE_URL = '/hero-bg.jpg';

const sections = [
  {
    href: '/reggae-quarterly',
    title: 'Reggae Quarterly',
    subtitle: 'Magazine Archive',
    description: 'Issues of the quarterly magazine documenting Jamaican music and culture through the 1980s.',
    icon: '◎',
  },
  {
    href: '/books',
    title: 'Books',
    subtitle: 'Reading Room',
    description: 'A library of books on reggae, roots culture, and the people who shaped a generation.',
    icon: '◻',
  },
  {
    href: '/photographs',
    title: 'Photographs',
    subtitle: 'Jamaica & Beyond',
    description: 'A photographic record of Jamaica — the people, the music, the landscape.',
    icon: '◈',
  },
  {
    href: '/witness-to-reggae',
    title: 'Witness to Reggae',
    subtitle: 'By Beth Lesser',
    description: 'First-hand accounts and reflections from years of travelling to Jamaica and living its music.',
    icon: '◇',
  },
  {
    href: '/music',
    title: 'Music',
    subtitle: 'Roots & Culture',
    description: 'Artists, labels, and recordings that defined reggae across the decades.',
    icon: '♩',
  },
  {
    href: '/links',
    title: 'Links',
    subtitle: 'Resources & Friends',
    description: 'A collection of links to Jamaica, reggae, photography, and kindred spirits.',
    icon: '◉',
  },
];

export default function HomePage() {
  return (
    <div>

      {/* ── Hero / Bio ─────────────────────────────────────────────── */}
      <section
        className="relative -mx-4 sm:-mx-8 -mt-10 mb-16 overflow-hidden"
        style={HERO_IMAGE_URL ? {
          backgroundImage: `url(${HERO_IMAGE_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundColor: '#234D38',
        } : { backgroundColor: '#234D38' }}
      >
        {/* Overlay */}
        <div className={`absolute inset-0 ${
          HERO_IMAGE_URL
            ? 'bg-gradient-to-b from-[#0D1C0F]/80 via-[#0D1C0F]/65 to-[#0D1C0F]/80'
            : 'jamaica-texture'
        }`} />
        <div className="gold-rule" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 py-20 sm:py-32">

          {/* Title */}
          <h2
            className="text-[#E8CC7A] text-3xl sm:text-[2.6rem] font-normal mb-1 leading-tight"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif', textShadow: '0 2px 12px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.7)' }}
          >
            Witness To Reggae
          </h2>
          <p
            className="text-[#C8A200] text-sm tracking-[0.25em] uppercase mb-8"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}
          >
            The 80&rsquo;s Archive &nbsp;·&nbsp; By Beth Lesser
          </p>

          {/* Gold rule */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-10 bg-[#C8A200]/50" />
            <span className="text-[#C8A200]/50 text-xs">◆</span>
          </div>

          {/* Body text */}
          <div
            className="text-white text-lg sm:text-xl leading-loose space-y-5 bg-black/40 rounded-sm px-6 py-5 backdrop-blur-sm"
            style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}
          >
            <p>
              During the 1980s, my husband and I traveled frequently to Kingston, Jamaica and Brooklyn, NY
              from our home in Toronto, Canada to follow the changing reggae scene. At the time, we were
              publishing <em className="text-[#E8CC7A]">Reggae Quarterly</em> magazine and Dave was hosting
              Reggae Showcase on CKLN radio.
            </p>
            <p>
              In the 1980s reggae was changing fast, moving from the heavy roots sound of suffering and
              redemption to the lighter, faster, digitized sound of modern dancehall. This conversion to
              digital instrumentation and production turned reggae music upside down.
            </p>
            <p>
              My husband and I saw it happen. We saw Junjo&rsquo;s Volcano empire rise meteorically and then
              crash as his young artists emigrated or met untimely deaths. We witnessed Jah Love&rsquo;s
              Brigadier Jerry take over the dancehall scene without ever having recorded a 45 — powered by
              the new popularity of dancehall cassettes. We were in Waterhouse when King Jammy unleashed
              his Sleng Teng rhythm to an analog world and, one by one, producers dropped their previously
              recorded rhythms and started building again from scratch using programmable keyboards and drum
              machines. We were in Jammy&rsquo;s yard while he cut the dubplates for the Clash of the
              Century, the event that brought dancehall culture to the larger Jamaican audience.
            </p>
            <p>
              Over those years, I collected an archive of material that I would like to make available to
              the public — to present and future reggae scholars and fans.
            </p>
            <p className="text-white/70 italic text-base">
              The material that appears on this website is just the start. I will be attempting to add
              material to this archive as funds come in.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              href="/photographs"
              className="px-7 py-3 bg-[#C8A200] text-[#163320] text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#E8CC7A] transition-colors"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              View Photographs
            </Link>
            <Link
              href="/witness-to-reggae"
              className="px-7 py-3 border border-[#C8A200]/60 text-[#E8CC7A] text-xs tracking-[0.2em] uppercase hover:border-[#C8A200] hover:text-white transition-colors"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Read the Book
            </Link>
          </div>
        </div>

        <div className="gold-rule" />
      </section>

      {/* ── Section label ─────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px flex-1 bg-[#C8A200]/30" />
        <p
          className="text-[#C8A200] text-[0.65rem] tracking-[0.4em] uppercase flex-shrink-0"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Explore the Archive
        </p>
        <div className="h-px flex-1 bg-[#C8A200]/30" />
      </div>

      {/* ── Section cards ─────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group relative bg-[#234D38] border border-[#C8A200]/20 hover:border-[#C8A200]/70 rounded-sm p-7 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-1 overflow-hidden"
            style={{ boxShadow: '0 2px 16px rgba(10,20,9,0.25)' }}
          >
            <div className="absolute inset-0 group-hover:bg-[#C8A200]/5 transition-all duration-300 pointer-events-none" />
            <span className="text-[#C8A200] text-2xl leading-none">{s.icon}</span>
            <div className="flex flex-col gap-1">
              <p
                className="text-[0.6rem] tracking-[0.35em] uppercase text-[#C8A200]/70"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                {s.subtitle}
              </p>
              <h2
                className="text-xl text-[#E8CC7A] font-normal group-hover:text-white transition-colors"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                {s.title}
              </h2>
              <p
                className="text-[#C8B896]/70 text-base leading-relaxed mt-1"
                style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}
              >
                {s.description}
              </p>
            </div>
            <span
              className="text-[#C8A200]/50 group-hover:text-[#C8A200] text-xs tracking-[0.2em] uppercase mt-auto transition-colors"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Explore &rarr;
            </span>
          </Link>
        ))}
      </div>

    </div>
  );
}
