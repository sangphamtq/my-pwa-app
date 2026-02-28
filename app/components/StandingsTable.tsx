'use client'

import { useEffect, useState } from 'react'
import TeamCrest from './TeamCrest'

interface TeamEntry {
  overall: {
    position: number
    played: number
    won: number
    drawn: number
    lost: number
    goalsFor: number
    goalsAgainst: number
    points: number
    startingPosition: number
  }
  team: { name: string; id: string; shortName: string; abbr: string }
}

const ZONE_COLORS = {
  champions: '#00FF87', // 1-4
  europa: '#4FD1FF',    // 5
  conference: '#A78BFA', // 6
  relegation: '#FF2882', // 18-20
}

function getZone(pos: number) {
  if (pos <= 4) return ZONE_COLORS.champions
  if (pos === 5) return ZONE_COLORS.europa
  if (pos === 6) return ZONE_COLORS.conference
  if (pos >= 18) return ZONE_COLORS.relegation
  return 'transparent'
}

export default function StandingsTable() {
  const [entries, setEntries] = useState<TeamEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/standings')
      .then((r) => r.json())
      .then((data) => {
        const e: TeamEntry[] = data.tables?.[0]?.entries || []
        e.sort((a, b) => a.overall.position - b.overall.position)
        setEntries(e)
        setLoading(false)
      })
      .catch(() => {
        setError('Không thể tải bảng xếp hạng')
        setLoading(false)
      })
  }, [])

  if (loading) return <StandingsSkeleton />
  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/60">
        <div className="text-4xl mb-3">⚠️</div>
        <p>{error}</p>
      </div>
    )

  return (
    <div className="px-4 pb-8">
      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-xs" style={{ color: '#222222' }}>
        {[
          { color: ZONE_COLORS.champions, label: 'Champions League' },
          { color: ZONE_COLORS.europa, label: 'Europa League' },
          { color: ZONE_COLORS.conference, label: 'Conference League' },
          { color: ZONE_COLORS.relegation, label: 'Xuống hạng' },
        ].map((z) => (
          <div key={z.label} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ background: z.color, opacity: 0.8 }}
            />
            <span>{z.label}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden bg-white"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Header */}
        <div
          className="grid gap-1 px-3 py-2.5"
          style={{
            gridTemplateColumns: '28px 1fr 28px 28px 28px 28px 28px 36px',
            background: 'rgba(0,0,0,0.4)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {['#', 'Đội', 'Đ', 'T', 'H', 'B', 'HS', 'Đ'].map((h, i) => (
            <div
              key={i}
              className={`text-center text-xs font-bold tracking-wider ${i === 1 ? 'text-left' : ''}`}
              style={{
                color: '#222222',
                fontFamily: 'var(--font-barlow)',
                letterSpacing: '0.05em',
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {entries.map((entry, idx) => {
          const { overall, team } = entry
          const gd = overall.goalsFor - overall.goalsAgainst
          const zone = getZone(overall.position)
          const isTop4 = overall.position <= 4

          return (
            <div
              key={team.id}
              className="grid gap-1 px-3 py-2.5 items-center transition-colors hover:bg-white/5"
              style={{
                gridTemplateColumns: '28px 1fr 28px 28px 28px 28px 28px 36px',
                background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                borderLeft: zone !== 'transparent' ? `2px solid ${zone}` : '2px solid transparent',
                animationDelay: `${idx * 0.03}s`,
              }}
            >
              {/* Position */}
              <div
                className="text-center text-sm font-bold"
                style={{
                  fontFamily: 'var(--font-barlow)',
                  color: zone !== 'transparent' ? zone : '#222222',
                }}
              >
                {overall.position}
              </div>

              {/* Team */}
              <div className="flex items-center gap-2 min-w-0">
                <TeamCrest abbr={team.abbr} size={24} />
                <span
                  className="text-sm font-semibold truncate"
                  style={{
                    fontFamily: 'var(--font-barlow)',
                    color: isTop4 ? '#222222' : '#222222',
                  }}
                >
                  {team.shortName}
                </span>
              </div>

              {/* Stats */}
              {[
                overall.played,
                overall.won,
                overall.drawn,
                overall.lost,
                gd > 0 ? `+${gd}` : gd,
              ].map((val, i) => (
                <div
                  key={i}
                  className="text-center text-sm"
                  style={{
                    fontFamily: 'var(--font-barlow)',
                    color: '#222222',
                  }}
                >
                  {val}
                </div>
              ))}

              {/* Points */}
              <div
                className="text-center text-sm font-black"
                style={{
                  fontFamily: 'var(--font-barlow)',
                  color: isTop4 ? '#00FF87' : '#F8F8F8',
                  fontSize: '15px',
                }}
              >
                {overall.points}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StandingsSkeleton() {
  return (
    <div className="px-4 pb-8 space-y-1.5">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="h-12 rounded-lg animate-pulse"
          style={{ background: '#1A0A1C', animationDelay: `${i * 0.03}s` }}
        />
      ))}
    </div>
  )
}
