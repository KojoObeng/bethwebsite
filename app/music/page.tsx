import Image from 'next/image';

const cklnLinks = [
  {
    title: '1982 CKLN December 26 Sister Nancy and Reuben Ranks 60 min.',
    url: '#',
  },
  {
    title: '1983 CKLN Bobby Zarro, Supercat, Screecha Nice',
    url: '#',
  },
  {
    title: '1983–1987 CKLN 88.1 FM REGGAE SHOWCASE (David Kingston best of PT 1)',
    url: 'https://www.mixcloud.com/DaveBrown62/ckln-881-fm-_-reggae-showcase-david-kingston-best-of-pt-1-1983__1987/',
  },
  {
    title: '1985 (Dec.) CKLN 88.1 FM Youth Promotion Sound with David Kingston',
    url: 'https://www.mixcloud.com/DaveBrown62/youth-promotion-sound-with-d-kingston-of-ckln-881-fm-toronto-dec-1985-d-brown-collection/',
  },
];

export default function MusicPage() {
  return (
    <div className="max-w-3xl">

      {/* Section header */}
      <div className="mb-10">
        <h2
          className="text-3xl text-[#234D38] font-normal mb-3"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Music
        </h2>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-[#C4A55A]" />
          <span
            className="text-xs tracking-[0.25em] uppercase text-[#9B7320]"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Roots &amp; Culture
          </span>
        </div>
      </div>

      {/* Posters */}
      <div className="flex flex-wrap gap-6 mb-12">
        <div className="relative w-64 h-auto rounded-sm overflow-hidden border border-[#C8B896]" style={{ boxShadow: '0 4px 16px rgba(44,28,14,0.15)' }}>
          <Image
            src="/whitemusicposter.jpg"
            alt="Music poster"
            width={400}
            height={560}
            className="w-full h-auto object-cover"
            unoptimized
          />
        </div>
        <div className="relative w-64 h-auto rounded-sm overflow-hidden border border-[#C8B896]" style={{ boxShadow: '0 4px 16px rgba(44,28,14,0.15)' }}>
          <Image
            src="/pinkmusicposter.jpg"
            alt="Music poster"
            width={400}
            height={560}
            className="w-full h-auto object-cover"
            unoptimized
          />
        </div>
      </div>

      {/* CKLN section */}
      <div className="mb-10">
        <h3
          className="text-2xl text-[#234D38] font-normal mb-4"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          CKLN Reggae Showcase 1982–1992
        </h3>
        <p
          className="text-[#5A4030] text-base leading-relaxed mb-6"
          style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}
        >
          Radio show hosted by David Kingston, aka Lord Selector. Download or listen
          on-line by clicking on the links below
        </p>

        <ul className="flex flex-col gap-3 mb-6">
          {cklnLinks.map((link) => (
            <li key={link.title} className="flex items-start gap-3">
              <span className="text-[#C4A55A] mt-0.5 flex-shrink-0 text-sm">◆</span>
              <a
                href={link.url}
                target={link.url !== '#' ? '_blank' : undefined}
                rel={link.url !== '#' ? 'noopener noreferrer' : undefined}
                className={`text-base transition-colors ${
                  link.url === '#'
                    ? 'text-[#A89070] cursor-default'
                    : 'text-[#234D38] hover:text-[#9B7320] underline'
                }`}
                style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>

        <p
          className="text-[#9B7320] text-sm italic"
          style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}
        >
          More coming soon
        </p>
      </div>

      {/* Gold rule */}
      <div className="flex items-center gap-3 my-10">
        <div className="h-px flex-1 bg-[#C8A200]/30" />
        <span className="text-[#C8A200]/50 text-xs">◆</span>
        <div className="h-px flex-1 bg-[#C8A200]/30" />
      </div>

      {/* Dance cassettes section */}
      <div className="mb-12">
        <h3
          className="text-2xl text-[#234D38] font-normal mb-4"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Dance cassettes – sessions recorded live from sound systems in Kingston Jamaica
        </h3>

        <ul className="flex flex-col gap-3">
          <li className="flex items-start gap-3">
            <span className="text-[#C4A55A] mt-0.5 flex-shrink-0 text-sm">◆</span>
            <a
              href="https://www.mixcloud.com/DaveBrown62/?utm_source=notification&utm_medium=email&utm_campaign=notification_new_upload&utm_content=html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#234D38] hover:text-[#9B7320] transition-colors text-base"
              style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}
            >
              Dave Brown Soundtape Archive Toronto
            </a>
          </li>
        </ul>
      </div>

      {/* Bottom image */}
      <div className="border border-[#C8B896] rounded-sm overflow-hidden" style={{ boxShadow: '0 4px 16px rgba(44,28,14,0.15)' }}>
        <Image
          src="/musicstudio.jpg"
          alt="Music studio"
          width={900}
          height={600}
          className="w-full h-auto object-cover"
          unoptimized
        />
      </div>

    </div>
  );
}
