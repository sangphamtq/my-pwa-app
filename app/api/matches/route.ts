import { NextResponse } from 'next/server'

export const revalidate = 300 // 5 minutes

export async function GET() {
  try {
    const res = await fetch(
      'https://sdp-prem-prod.premier-league-prod.pulselive.com/api/v2/matches?competition=8&season=2025&matchweek=28&_limit=20',
      { next: { revalidate: 300 } }
    )
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }
}
