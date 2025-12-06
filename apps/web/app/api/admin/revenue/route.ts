import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request);

    if (!user || user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const approvedPayments = await prisma.payment.findMany({
      where: {
        status: 'APPROVED',
      },
    });

    const totalRevenue = approvedPayments.reduce(
      (acc, payment) => acc + payment.amount,
      0
    );

    return NextResponse.json({ totalRevenue });
  } catch (error) {
    console.error('Error fetching total revenue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
