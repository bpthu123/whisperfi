import { NextResponse } from 'next/server';
import { getUsageStats, resetUsage } from '@/lib/ai/rate-limiter';

export async function GET() {
  return NextResponse.json(getUsageStats());
}

export async function DELETE() {
  resetUsage();
  return NextResponse.json({ message: 'Usage counter reset', ...getUsageStats() });
}
