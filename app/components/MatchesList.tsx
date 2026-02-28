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
  kickoff: string
  period: string
  clock?: string
  ground: string
  matchWeek: number
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + ' UTC')
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

  return d.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
    timeZone: 'Asia/Ho_Chi_Minh',
  }) + ` • ${time}`
}

function groupByDate(matches: Match[]) {
  const groups: Record<string, Match[]> = {}
  matches.forEach((m) => {
    const d = new Date(m.kickoff + ' UTC')
    const key = d.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone: 'Asia/Ho_Chi_Minh',
    })
    if (!groups[key]) groups[key] = []
    groups[key].push(m)
  })
  return groups
}

export default function MatchesList() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/matches')
      .then((r) => r.json())
      .then((data) => {
        setMatches(data.data || [])
        setLoading(false)
      })
      .catch(() => {
        setError('Không thể tải dữ liệu')
        setLoading(false)
      })
  }, [])

  if (loading) return <MatchesSkeleton />
  if (error) return <ErrorState message={error} />

  const groups = groupByDate(matches)

  return (
    <div className="space-y-6 px-4 pb-8">
      {Object.entries(groups).map(([date, dayMatches], gi) => (
        <div key={date} className={`animate-fade-in`} style={{ animationDelay: `${gi * 0.08}s` }}>
          {/* Date header */}
          <div className="flex items-center gap-3 mb-3 mt-2">
            <div className="h-px flex-1 bg-white/10" />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{
                color: '#00FF87',
                fontFamily: 'var(--font-barlow)',
                letterSpacing: '0.12em',
              }}
            >
              {date}
            </span>
            <div className="h-px flex-1 bg-white/10" />
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
  const isLive = match.period === 'Live' || match.period === 'HalfTime'
  const isFinished = match.period === 'FullTime'
  const hasScore = match.homeTeam.score !== undefined

  return (
    <div
      className="match-card relative rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1A0A1C 0%, #0F0F1E 100%)',
        border: isLive ? '1px solid rgba(255,40,130,0.4)' : '1px solid rgba(255,255,255,0.06)',
        animationDelay: `${index * 0.05}s`,
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
          {hasScore ? (
            <div
              className="flex items-center gap-2 text-2xl font-black"
              style={{ fontFamily: 'var(--font-barlow)', fontWeight: 900 }}
            >
              <span
                style={{
                  color: isLive ? '#FF2882' : isFinished ? '#F8F8F8' : '#F8F8F8',
                }}
              >
                {match.homeTeam.score}
              </span>
              <span className="text-white/20">:</span>
              <span
                style={{
                  color: isLive ? '#FF2882' : isFinished ? '#F8F8F8' : '#F8F8F8',
                }}
              >
                {match.awayTeam.score}
              </span>
            </div>
          ) : (
            <div
              className="text-lg font-bold"
              style={{ fontFamily: 'var(--font-barlow)', color: '#00FF87' }}
            >
              {new Date(match.kickoff + ' UTC').toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Ho_Chi_Minh',
              })}
            </div>
          )}

          {/* Status badge */}
          <div className="mt-1">
            {isLive && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold tracking-wider"
                style={{
                  background: 'rgba(255,40,130,0.2)',
                  color: '#FF2882',
                  fontFamily: 'var(--font-barlow)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                }}
              >
                ● TRỰC TIẾP {match.clock ? `${match.clock}'` : ''}
              </span>
            )}
            {isFinished && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#ffffff66',
                  fontFamily: 'var(--font-barlow)',
                  fontSize: '10px',
                  letterSpacing: '0.05em',
                }}
              >
                KẾT THÚC
              </span>
            )}
            {!hasScore && !isLive && (
              <span
                style={{
                  fontSize: '10px',
                  color: '#ffffff44',
                  fontFamily: 'var(--font-barlow)',
                }}
              >
                VS
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
        style={{ fontSize: '10px', color: '#ffffff44', fontFamily: 'var(--font-dm-sans)' }}
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
          style={{ background: '#1A0A1C', animationDelay: `${i * 0.05}s` }}
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
