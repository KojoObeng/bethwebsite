const links = [
  {
    title: 'One Love Books',
    url: 'http://onelovebooks.com/',
    description: '',
  },
  {
    title: "Alpha Boy's School",
    url: 'http://alphaboysschool.org/',
    description: '',
  },
  {
    title: 'Kei Miller',
    url: 'https://www.facebook.com/Kei-Miller-167074302410/',
    description: '',
  },
  {
    title: '1980s Dance Cassettes',
    url: 'http://www.whocorkthedance.com/',
    description: '',
  },
  {
    title: 'Mento Music',
    url: 'http://www.mentomusic.com/whatismento.htm',
    description: '',
  },
  {
    title: 'Augustus Pablo & The Rockers Band – Live in London 1989',
    url: 'https://www.youtube.com/watch?v=6ix7RI3HSXQ&t=2884s',
    description: '',
  },
];

export default function LinksPage() {
  return (
    <div>
      {/* Section header */}
      <div className="mb-10">
        <h2
          className="text-3xl text-[#234D38] font-normal mb-3"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Links
        </h2>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-[#C4A55A]" />
          <span
            className="text-xs tracking-[0.25em] uppercase text-[#9B7320]"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Resources &amp; Friends
          </span>
        </div>
        <p
          className="text-[#7A6545] text-base max-w-xl leading-relaxed"
          style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}
        >
          A collection of links to places, people, and publications of interest.
        </p>
      </div>

      <ul className="flex flex-col gap-4 max-w-xl">
        {links.map((link) => (
          <li key={link.title} className="flex items-start gap-3">
            <span className="text-[#C4A55A] mt-0.5 flex-shrink-0 text-sm">◆</span>
            <div>
              <a
                href={link.url}
                target={link.url !== '#' ? '_blank' : undefined}
                rel={link.url !== '#' ? 'noopener noreferrer' : undefined}
                className={`font-medium transition-colors ${
                  link.url === '#'
                    ? 'text-[#A89070] cursor-default'
                    : 'text-[#234D38] hover:text-[#9B7320]'
                }`}
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                {link.title}
              </a>
              {link.description && (
                <p
                  className="text-[#7A6545] text-sm mt-0.5"
                  style={{ fontFamily: 'var(--font-garamond), Georgia, serif' }}
                >
                  {link.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
