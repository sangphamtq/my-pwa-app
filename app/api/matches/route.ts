import { NextResponse, NextRequest } from 'next/server'

export const revalidate = 300 // 5 minutes

const MIN_MATCHWEEK = 1
const MAX_MATCHWEEK = 38

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const matchweekParam = searchParams.get('matchweek')

  let matchweek = Number(matchweekParam ?? MIN_MATCHWEEK)
  if (!Number.isFinite(matchweek)) {
    matchweek = MIN_MATCHWEEK
  }

  // Clamp to valid range
  if (matchweek < MIN_MATCHWEEK) matchweek = MIN_MATCHWEEK
  if (matchweek > MAX_MATCHWEEK) matchweek = MAX_MATCHWEEK

  const url = `https://sdp-prem-prod.premier-league-prod.pulselive.com/api/v2/matches?competition=8&season=2025&matchweek=${matchweek}&_limit=50`

  try {
    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch matches from source' },
        { status: 502 }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }
}
