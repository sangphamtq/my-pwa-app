import { NextResponse } from 'next/server'

export const revalidate = 300

export async function GET() {
  try {
    const res = await fetch(
      'https://sdp-prem-prod.premier-league-prod.pulselive.com/api/v5/competitions/8/seasons/2025/standings?live=false',
      { next: { revalidate: 300 } }
    )
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch standings' }, { status: 500 })
  }
}
