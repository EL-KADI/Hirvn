import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { Role } from '@prisma/client';
import multer from 'multer';
import { promisify } from 'util';

const upload = multer({ dest: 'uploads/' });

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);

    if (!user || user.role !== Role.CLIENT) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const middleware = promisify(upload.single('proofOfPayment'));
    await middleware(request, new NextResponse());

    const { file } = request;

    if (!file) {
      return NextResponse.json({ error: 'Missing proof of payment' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id: params.id } });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const payment = await prisma.payment.create({
      data: {
        amount: project.budget, // For now, we'll use the full budget
        proofOfPayment: file.path,
        projectId: params.id,
        clientId: user.userId,
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Payment submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
