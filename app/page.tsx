'use client'

import { useState } from 'react'
import MatchesList from './components/MatchesList'
import StandingsTable from './components/StandingsTable'

type Tab = 'matches' | 'standings'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('matches')

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

            <div className="ml-auto">
              <span
                className="text-xs px-2.5 py-1 rounded-full font-bold text-primary"
                style={{
                  background: 'rgba(0,255,135,0.1)',
                  fontFamily: 'var(--font-barlow)',
                  border: '1px solid rgba(0,255,135,0.6)',
                  letterSpacing: '0.05em',
                }}
              >
                VÒNG 28
              </span>
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
        {activeTab === 'matches' ? <MatchesList /> : <StandingsTable />}
      </main>

      {/* Bottom padding for safe area */}
      <div className="h-safe-bottom h-6" />
    </div>
  )
}
