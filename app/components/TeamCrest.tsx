'use client'

import Image from 'next/image'

const TEAM_LOGOS: Record<string, { src: string; alt: string }> = {
  ARS: { src: '/logos/arsenal.svg', alt: 'Arsenal' },
  CHE: { src: '/logos/chelsea.svg', alt: 'Chelsea' },
  LIV: { src: '/logos/liverpool.svg', alt: 'Liverpool' },
  MCI: { src: '/logos/man-city.svg', alt: 'Manchester City' },
  MUN: { src: '/logos/man-united.svg', alt: 'Manchester United' },
  TOT: { src: '/logos/tottenham.svg', alt: 'Tottenham Hotspur' },
  NEW: { src: '/logos/newcastle.svg', alt: 'Newcastle United' },
  AVL: { src: '/logos/aston-villa.svg', alt: 'Aston Villa' },
  BHA: { src: '/logos/brighton.svg', alt: 'Brighton & Hove Albion' },
  WHU: { src: '/logos/west-ham.svg', alt: 'West Ham United' },
  EVE: { src: '/logos/everton.svg', alt: 'Everton' },
  BRE: { src: '/logos/brentford.svg', alt: 'Brentford' },
  FUL: { src: '/logos/fulham.svg', alt: 'Fulham' },
  BOU: { src: '/logos/bournemouth.svg', alt: 'Bournemouth' },
  NFO: { src: '/logos/forest.svg', alt: 'Nottingham Forest' },
  CRY: { src: '/logos/crystal-palace.svg', alt: 'Crystal Palace' },
  LEE: { src: '/logos/leeds.svg', alt: 'Leeds United' },
  BUR: { src: '/logos/burnley.svg', alt: 'Burnley' },
  WOL: { src: '/logos/wolves.svg', alt: 'Wolverhampton Wanderers' },
  SUN: { src: '/logos/sunderland.svg', alt: 'Sunderland' },
}

const TEAM_COLORS: Record<string, { bg: string; text: string }> = {
  ARS: { bg: '#EF0107', text: '#fff' },
  CHE: { bg: '#034694', text: '#fff' },
  LIV: { bg: '#C8102E', text: '#fff' },
  MCI: { bg: '#6CABDD', text: '#1C2C5B' },
  MUN: { bg: '#DA291C', text: '#fff' },
  TOT: { bg: '#132257', text: '#fff' },
  NEW: { bg: '#241F20', text: '#fff' },
  AVL: { bg: '#95BFE5', text: '#670E36' },
  BHA: { bg: '#0057B8', text: '#fff' },
  WHU: { bg: '#7A263A', text: '#1BB1E7' },
  EVE: { bg: '#003399', text: '#fff' },
  BRE: { bg: '#E30613', text: '#fff' },
  FUL: { bg: '#CC0000', text: '#fff' },
  BOU: { bg: '#DA291C', text: '#000' },
  NFO: { bg: '#DD0000', text: '#fff' },
  CRY: { bg: '#1B458F', text: '#C4122E' },
  LEE: { bg: '#FFCD00', text: '#1D428A' },
  BUR: { bg: '#6C1D45', text: '#99D6EA' },
  WOL: { bg: '#FDB913', text: '#231F20' },
  SUN: { bg: '#EB172B', text: '#fff' },
}

export default function TeamCrest({
  abbr,
  size = 40,
}: {
  abbr: string
  size?: number
}) {
  const logo = TEAM_LOGOS[abbr]

  if (logo) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.15
        }}
        className="flex items-center justify-center flex-shrink-0 select-none bg-white/5"
      >
        <Image
          src={logo.src}
          alt={logo.alt}
          width={size}
          height={size}
          className="object-contain w-full h-full"
        />
      </div>
    )
  }

  const colors = TEAM_COLORS[abbr] || { bg: '#555', text: '#fff' }

  return (
    <div
      style={{
        width: size,
        height: size,
        background: colors.bg,
        color: colors.text,
        fontSize: size * 0.28,
        borderRadius: size * 0.15,
        fontFamily: 'var(--font-barlow)',
        fontWeight: 800,
        letterSpacing: '-0.5px',
      }}
      className="flex items-center justify-center flex-shrink-0 select-none"
    >
      {abbr}
    </div>
  )
}
