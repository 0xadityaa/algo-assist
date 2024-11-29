// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const response = await fetch('http://localhost:3000/api/[collection-slug]/logout', { // Replace [collection-slug]
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle the response (e.g., check status, redirect, etc.)
    if (response.ok) {
      // Successful logout
      return NextResponse.json({ message: 'Logout successful' }, { status: 200 }); 
    } else {
      // Handle logout error (e.g., display an error message)
      return NextResponse.json({ error: 'Logout failed' }, { status: response.status });
    }
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
