// app/api/get-result/route.ts
import { NextRequest, NextResponse } from 'next/server';

const JUDGE0_API_URL = 'https://judge0-ce.p.sulu.sh';

export async function GET(request: NextRequest) {
  try {
    // Get token from URL parameters
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Construct the full URL for Judge0 API
    const url = new URL('/submissions/batch', JUDGE0_API_URL);
    url.searchParams.append('tokens', token);
    url.searchParams.append('base64_encoded', 'true');
    
    // Make request to Judge0
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.JUDGE0_API_KEY}`
      },
    });

    if (!response.ok) {
      throw new Error(`Judge0 API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching submission results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission results' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; // Disable caching for this route
