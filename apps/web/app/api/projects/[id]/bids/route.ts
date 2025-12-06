import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { Role } from '@prisma/client';
import { notificationsQueue } from '@/lib/queue/queue';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);

    if (!user || user.role !== Role.FREELANCER) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { proposal, amount } = await request.json();

    if (!proposal || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const bid = await prisma.bid.create({
      data: {
        proposal,
        amount: parseInt(amount),
        projectId: params.id,
        freelancerId: user.userId,
      },
    });

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { client: true },
    });

    if (project) {
      await notificationsQueue.add('new-bid', {
        type: 'NEW_BID',
        data: {
          clientEmail: project.client.email,
          clientName: project.client.name,
          projectTitle: project.title,
          freelancerId: user.userId,
          clientId: project.clientId,
        },
      });
    }

    return NextResponse.json(bid, { status: 201 });
  } catch (error) {
    console.error('Bid submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
