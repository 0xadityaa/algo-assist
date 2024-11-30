// src/app/api/questions/route.ts
import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function GET() {
  try {
    const payload = await getPayload({ config });

    const { docs: questions } = await payload.find({
      collection: 'questions',
      depth: 2, 
      page: 1,
      limit: 10,
      pagination: false, 
      where: {}, 
      sort: '-title',
      fallbackLocale: false,
      overrideAccess: false,
      showHiddenFields: true, 
    });

    return NextResponse.json(questions); 
  } catch (error: any) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: error.message || 'An error occurred while fetching questions.' }, { status: 500 });
  }
}
