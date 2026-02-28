'use client'

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
