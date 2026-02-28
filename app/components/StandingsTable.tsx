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

interface LiveTeamInfo {
  scoreText: string
  clock?: string
  period: string
  homeScore: number
  awayScore: number
  isHome: boolean
}

const ZONE_COLORS = {
  champions: '#00c568', // 1-4
  europa: '#03bdff',    // 5
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
  const [liveByTeam, setLiveByTeam] = useState<Record<string, LiveTeamInfo>>({})

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

  // Poll live matches to attach live score + time to each team
  useEffect(() => {
    let cancelled = false

    const loadMatches = () => {
      fetch('/api/matches')
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return

          const matches: any[] = data.data || []
          const nextLiveByTeam: Record<string, LiveTeamInfo> = {}

          matches.forEach((m) => {
            const period: string = m.period
            const isFinished = period === 'FullTime'
            const isLive = period !== 'PreMatch' && !isFinished
            const home = m.homeTeam
            const away = m.awayTeam

            if (!isLive || !home || !away) return

            const homeScore = typeof home.score === 'number' ? home.score : 0
            const awayScore = typeof away.score === 'number' ? away.score : 0
            const scoreText = `${homeScore}-${awayScore}`
            const clock: string | undefined = m.clock

            if (home.id) {
              nextLiveByTeam[String(home.id)] = {
                scoreText,
                clock,
                period,
                homeScore,
                awayScore,
                isHome: true,
              }
            }

            if (away.id) {
              nextLiveByTeam[String(away.id)] = {
                scoreText,
                clock,
                period,
                homeScore,
                awayScore,
                isHome: false,
              }
            }
          })

          setLiveByTeam(nextLiveByTeam)
        })
        .catch(() => {
          if (cancelled) return
          // Silent fail – standings vẫn hiển thị bình thường
        })
    }

    loadMatches()
    const intervalId = setInterval(loadMatches, 10000)

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
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
            gridTemplateColumns: '28px 1fr 28px 28px 28px 28px 28px 28px 28px 36px',
            background: '#00c568',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {['#', 'Đội', 'Đ', 'T', 'H', 'B', 'GA', 'GF', 'HS', 'Đ'].map((h, i) => (
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
          const isMU = team.abbr === 'MUN'
          const live = liveByTeam[team.id]
          const scoreState = live
            ? live.homeScore > live.awayScore
              ? live.isHome
                ? 'win'
                : 'lose'
              : live.awayScore > live.homeScore
                ? live.isHome
                  ? 'lose'
                  : 'win'
                : 'draw'
            : null

          return (
            <div
              key={team.id}
              className="grid gap-1 px-3 py-2.5 items-center transition-colors hover:bg-white/5"
              style={{
                gridTemplateColumns: '28px 1fr 28px 28px 28px 28px 28px 28px 28px 36px',
                background: isMU
                  ? 'linear-gradient(90deg, #f78d8d 0%, #ffd2b5 100%)'
                  : 'transparent',
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                borderLeft: zone !== 'transparent' ? `2px solid ${zone}` : '2px solid transparent',
                animationDelay: `${idx * 0.03}s`,
              }}
            >
              {/* Position */}
              <div
                className="text-center text-sm font-bold"
                style={{
                  fontFamily: 'var(--font-barlow)',
                  color: isMU ? 'white' : zone !== 'transparent' ? zone : '#222222',
                }}
              >
                {overall.position}
              </div>

              {/* Team + live info */}
              <div className="flex items-center gap-2 min-w-0">
                <TeamCrest abbr={team.abbr} size={24} />
                <div className="flex gap-2 min-w-0">
                  <span
                    className="text-sm font-semibold truncate"
                    style={{
                      fontFamily: 'var(--font-barlow)',
                      color: isTop4 ? '#222222' : '#222222',
                    }}
                  >
                    {team.shortName}
                  </span>
                  {live && (
                    <div className="mt-0.5 flex items-center gap-1">
                      {live.scoreText && scoreState && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[11px] font-semibold"
                          style={{
                            background:
                              scoreState === 'win'
                                ? '#00c568'
                                : scoreState === 'lose'
                                  ? '#DC2626'
                                  : '#6B7280',
                            color: 'white',
                            fontFamily: 'var(--font-barlow)',
                          }}
                        >
                          {live.scoreText}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              {[
                overall.played,
                overall.won,
                overall.drawn,
                overall.lost,
                overall.goalsAgainst,
                overall.goalsFor,
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
                className="text-center text-sm font-bold"
                style={{
                  fontFamily: 'var(--font-barlow)',
                  color: isTop4 ? '#00c568' : '#444444',
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
          style={{ background: '#eecaf6', animationDelay: `${i * 0.03}s` }}
        />
      ))}
    </div>
  )
}
