'use client'

import { useState, useRef, useEffect } from 'react'
import MatchesList from './components/MatchesList'
import StandingsTable from './components/StandingsTable'

type Tab = 'matches' | 'standings'

const MIN_MATCHWEEK = 1
const MAX_MATCHWEEK = 38

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('matches')
  const [matchweek, setMatchweek] = useState<number>(28)
  const [pickerOpen, setPickerOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pickerOpen) return
    const close = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false)
      }
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [pickerOpen])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-center gap-3 pt-safe pt-4 pb-1">
            {/* EPL Badge */}
            <div
              className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #FF2882 0%, #37003C 100%)',
                boxShadow: '0 4px 12px rgba(255,40,130,0.3)',
              }}
            >
              <span
                className="text-white font-black text-xs tracking-tighter"
                style={{ fontFamily: 'var(--font-barlow)', lineHeight: 1 }}
              >
                EPL
              </span>
            </div>

            <div className="flex flex-col">
              <h1
                className="text-lg font-black leading-none tracking-tight"
                style={{
                  fontFamily: 'var(--font-barlow)',
                  letterSpacing: '-0.5px',
                }}
              >
                PREMIER LEAGUE
              </h1>
              <span
                className="text-xs font-medium text-primary"
                style={{ fontFamily: 'var(--font-barlow)', letterSpacing: '0.05em' }}
              >
                SEASON 2025/26
              </span>
            </div>

            {/* Matchweek: chỉ hiện khi tab Lịch thi đấu + có dropdown chọn nhanh */}
            <div className="ml-auto relative" ref={pickerRef}>
              {activeTab === 'matches' ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setMatchweek((w) => Math.max(MIN_MATCHWEEK, w - 1))}
                    disabled={matchweek <= MIN_MATCHWEEK}
                    className="p-1 rounded-md disabled:opacity-40 text-primary hover:bg-white/10"
                    aria-label="Vòng trước"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickerOpen((o) => !o)}
                    className="text-xs px-2.5 py-1 rounded-full font-bold text-primary inline-flex items-center gap-0.5"
                    style={{
                      background: 'rgba(0,255,135,0.1)',
                      fontFamily: 'var(--font-barlow)',
                      border: '1px solid rgba(0,255,135,0.6)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    VÒNG {matchweek}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={pickerOpen ? 'rotate-180' : ''}><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMatchweek((w) => Math.min(MAX_MATCHWEEK, w + 1))}
                    disabled={matchweek >= MAX_MATCHWEEK}
                    className="p-1 rounded-md disabled:opacity-40 text-primary hover:bg-white/10"
                    aria-label="Vòng sau"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
              ) : (
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-bold text-primary"
                  style={{
                    background: 'rgba(0,255,135,0.1)',
                    fontFamily: 'var(--font-barlow)',
                    border: '1px solid rgba(0,255,135,0.6)',
                    letterSpacing: '0.05em',
                  }}
                >
                  VÒNG {matchweek}
                </span>
              )}

              {activeTab === 'matches' && pickerOpen && (
                <div
                  className="absolute right-0 top-full mt-1 p-2 rounded-xl shadow-xl border border-white/10 overflow-hidden z-50"
                  style={{
                    background: 'rgba(20,20,25,0.98)',
                    backdropFilter: 'blur(12px)',
                    minWidth: '350px',
                  }}
                >
                  <div className="text-[10px] font-semibold text-primary/80 px-1 pb-1.5" style={{ fontFamily: 'var(--font-barlow)' }}>
                    Chọn vòng
                  </div>
                  <div className="grid grid-cols-10 gap-1 max-h-[220px] overflow-y-auto">
                    {Array.from({ length: MAX_MATCHWEEK }, (_, i) => i + 1).map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => {
                          setMatchweek(w)
                          setPickerOpen(false)
                        }}
                        className="w-7 h-7 rounded-md text-xs font-bold flex items-center justify-center transition-colors"
                        style={{
                          fontFamily: 'var(--font-barlow)',
                          background: w === matchweek ? 'rgba(0,255,135,0.25)' : 'rgba(255,255,255,0.08)',
                          color: w === matchweek ? '#00ff87' : 'rgba(255,255,255,0.9)',
                          border: w === matchweek ? '1px solid rgba(0,255,135,0.6)' : '1px solid transparent',
                        }}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex mt-3">
            {(
              [
                { key: 'matches', label: 'Lịch thi đấu', icon: '⚽' },
                { key: 'standings', label: 'Bảng xếp hạng', icon: '🏆' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative flex-1 flex items-center justify-center gap-1.5 pb-3 pt-1 transition-all"
                style={{
                  fontFamily: 'var(--font-barlow)',
                  fontSize: '15px',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  color: activeTab === tab.key ? '#222222' : 'rgba(0,0,0,0.5)',
                  borderBottom: activeTab === tab.key
                    ? '2px solid #00c568'
                    : '2px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '14px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto pt-4">
        {activeTab === 'matches' ? <MatchesList matchweek={matchweek} /> : <StandingsTable />}
      </main>

      {/* Bottom padding for safe area */}
      <div className="h-safe-bottom h-6" />
    </div>
  )
}
