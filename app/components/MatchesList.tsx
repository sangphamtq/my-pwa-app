'use client'

import { useEffect, useState } from 'react'
import TeamCrest from './TeamCrest'

interface Team {
  name: string
  id: string
  shortName: string
  abbr: string
  score?: number
  halfTimeScore?: number
}

interface Match {
  matchId: string
  homeTeam: Team
  awayTeam: Team
  kickoff: string // format: "YYYY-MM-DD HH:mm:ss"
  period: string
  clock?: string
  ground: string
  matchWeek: number
}

function parseKickoff(raw: string): Date | null {
  const match = raw.match(
    /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/
  )
  if (!match) return null

  const [, year, month, day, hour, minute, second] = match

  const d = new Date(
    Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    )
  )

  return isNaN(d.getTime()) ? null : d
}

function formatDate(dateStr: string) {
  const d = parseKickoff(dateStr)
  if (!d) return ''

  const now = new Date()
  const today = now.toDateString()
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)

  const time = d.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
  })

  if (d.toDateString() === today) return `Hôm nay • ${time}`
  if (d.toDateString() === tomorrow.toDateString()) return `Ngày mai • ${time}`

  return (
    d.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
      timeZone: 'Asia/Ho_Chi_Minh',
    }) + ` • ${time}`
  )
}

function formatRelativeKickoff(kickoff: string) {
  const d = parseKickoff(kickoff)
  if (!d) return ''

  const now = new Date()
  const diffMs = d.getTime() - now.getTime()
  const absMs = Math.abs(diffMs)

  const minutes = Math.round(absMs / 60000)
  const hours = Math.round(absMs / (60000 * 60))
  const days = Math.round(absMs / (60000 * 60 * 24))

  const inFuture = diffMs > 0

  if (minutes < 60) {
    if (minutes === 0) return inFuture ? 'Sắp bắt đầu' : 'Vừa kết thúc'
    return inFuture ? `Còn ${minutes} phút nữa` : `${minutes} phút trước`
  }

  if (hours < 24) {
    return inFuture ? `Còn ${hours} giờ nữa` : `${hours} giờ trước`
  }

  return inFuture ? `Còn ${days} ngày nữa` : `${days} ngày trước`
}

function groupByDate(matches: Match[]) {
  const groups: Record<string, Match[]> = {}
  matches.forEach((m) => {
    const d = parseKickoff(m.kickoff)
    if (!d) return

    const key = d.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone: 'Asia/Ho_Chi_Minh',
    })
    if (!groups[key]) groups[key] = []
    groups[key].push(m)
  })

  // Sort matches inside each date group by kickoff time (earliest first)
  Object.values(groups).forEach((dayMatches) => {
    dayMatches.sort((a, b) => {
      const da = parseKickoff(a.kickoff)
      const db = parseKickoff(b.kickoff)
      if (!da || !db) return 0
      return da.getTime() - db.getTime()
    })
  })

  return groups
}

interface MatchesListProps {
  matchweek: number
}

export default function MatchesList({ matchweek }: MatchesListProps) {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadMatches = () => {
      fetch(`/api/matches?matchweek=${matchweek}`)
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return
          setMatches(data.data || [])
          setError('')
        })
        .catch(() => {
          if (cancelled) return
          setError('Không thể tải dữ liệu')
        })
        .finally(() => {
          if (cancelled) return
          setLoading(false)
        })
    }

    // initial load
    loadMatches()

    // poll every 10s
    const intervalId = setInterval(loadMatches, 10000)

    return () => {
      cancelled = true
      clearInterval(intervalId)
    }
  }, [matchweek])

  if (loading) return <MatchesSkeleton />
  if (error) return <ErrorState message={error} />

  const groups = groupByDate(matches)

  return (
    <div className="space-y-6 px-4 pb-8">
      {Object.entries(groups).map(([date, dayMatches], gi) => (
        <div key={date} className={`animate-fade-in`} style={{ animationDelay: `${gi * 0.08}s` }}>
          {/* Date header */}
          <div className="flex items-center gap-3 mb-3 mt-2">
            <div className="h-px flex-1 bg-purple-800/10" />
            <span
              className="text-xs font-semibold tracking-widest uppercase text-primary"
              style={{
                fontFamily: 'var(--font-barlow)',
                letterSpacing: '0.12em',
              }}
            >
              {date}
            </span>
            <div className="h-px flex-1 bg-purple-800/10" />
          </div>

          <div className="space-y-2">
            {dayMatches.map((match, i) => (
              <MatchCard key={match.matchId} match={match} index={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function MatchCard({ match, index }: { match: Match; index: number }) {
  const isFinished = match.period === 'FullTime'
  const isLive = match.period !== 'PreMatch' && !isFinished
  const hasScore = match.homeTeam.score !== undefined
  const isMU = match.homeTeam.abbr == 'MUN' || match.awayTeam.abbr == 'MUN'
  // Kiểu highlight mới cho isMU
  // Dùng border dạng dashed nổi bật với gradient nhạt, thêm một nhãn "MU"
  // console.log(match.homeTeam.name, match)
  const highlightStyle = isMU
    ? {
        border: '2px dashed #DA291C',
        background: 'linear-gradient(90deg, #FFF1F1 0%, #FFD6D6 100%)',
        position: 'relative' as const,
        // Không dùng box-shadow cho cảm giác "nổi"
      }
    : {}

  return (
    <div
      className="match-card relative rounded-xl overflow-hidden"
      style={{
        background: 'white',
        border: isLive
          ? '1px solid rgba(255,40,130,0.4)'
          : '1px solid rgba(255,255,255,0.06)',
        animationDelay: `${index * 0.05}s`,
        ...highlightStyle,
      }}
    >
      {/* Live top border */}
      {isLive && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
      )}

      <div className="flex items-center gap-3 p-3 sm:p-4">
        {/* Home team */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span
            className="text-right text-sm sm:text-base font-semibold leading-tight"
            style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700 }}
          >
            {match.homeTeam.shortName}
          </span>
          <TeamCrest abbr={match.homeTeam.abbr} size={36} />
        </div>

        {/* Score / Time */}
        <div className="flex flex-col items-center min-w-[80px]">
          {hasScore && match.period !== 'PreMatch' ? (
            <div
              className="flex items-center gap-2 text-2xl font-black"
              style={{ fontFamily: 'var(--font-barlow)', fontWeight: 900 }}
            >
              <span
                style={{
                  color: isLive ? '#FF2882' : isFinished ? '#222222' : '#222222',
                }}
              >
                {match.homeTeam.score}
              </span>
              <span className="text-gray-600/40">:</span>
              <span
                style={{
                  color: isLive ? '#FF2882' : isFinished ? '#222222' : '#222222',
                }}
              >
                {match.awayTeam.score}
              </span>
            </div>
          ) : (
            <div
              className="text-lg font-bold text-primary"
              style={{ fontFamily: 'var(--font-barlow)' }}
            >
              {(() => {
                const d = parseKickoff(match.kickoff)
                if (!d) return ''
                return d.toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'Asia/Ho_Chi_Minh',
                })
              })()}
            </div>
          )}

          {/* Status badge */}
          <div className="mt-1">
            {isLive && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold tracking-wider inline-flex items-center gap-1"
                style={{
                  background: 'rgba(255,40,130,0.2)',
                  color: '#FF2882',
                  fontFamily: 'var(--font-barlow)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                }}
              >
                {/* Red blinking dot */}
                <span
                  className="inline-block align-middle"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#FF0000',
                    marginRight: '4px',
                    animation: 'blink-red-dot 1s infinite',
                  }}
                />
                {match.period === 'HalfTime'
                  ? 'Giữa hiệp'
                  : (
                      <>
                        TRỰC TIẾP {match.clock ? `${match.clock}'` : ''}
                      </>
                    )
                }
                {/* Add keyframes for blinking dot */}
                <style jsx>{`
                  @keyframes blink-red-dot {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.25; }
                  }
                `}</style>
              </span>
            )}
            {isFinished && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#222222',
                  fontFamily: 'var(--font-barlow)',
                  fontSize: '10px',
                  letterSpacing: '0.05em',
                }}
              >
                KẾT THÚC
              </span>
            )}
            {match.period === 'PreMatch' && (
              <span
                style={{
                  fontSize: '10px',
                  color: '#222222',
                  fontFamily: 'var(--font-barlow)',
                }}
              >
                {formatRelativeKickoff(match.kickoff)}
              </span>
            )}
          </div>
        </div>

        {/* Away team */}
        <div className="flex items-center gap-2 flex-1">
          <TeamCrest abbr={match.awayTeam.abbr} size={36} />
          <span
            className="text-sm sm:text-base font-semibold leading-tight"
            style={{ fontFamily: 'var(--font-barlow)', fontWeight: 700 }}
          >
            {match.awayTeam.shortName}
          </span>
        </div>
      </div>

      {/* Ground */}
      <div
        className="px-3 sm:px-4 pb-2 text-center"
        style={{ fontSize: '10px', color: '#222222', fontFamily: 'var(--font-dm-sans)' }}
      >
        {match.ground}
      </div>
    </div>
  )
}

function MatchesSkeleton() {
  return (
    <div className="space-y-3 px-4 pb-8">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-20 rounded-xl animate-pulse"
          style={{ background: '#eecaf6', animationDelay: `${i * 0.05}s` }}
        />
      ))}
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="text-4xl mb-4">⚠️</div>
      <p className="text-white/60">{message}</p>
    </div>
  )
}
