import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

interface UserPayload {
  userId: string;
  role: string;
}

export function getUserFromRequest(request: NextRequest): UserPayload | null {
  const accessToken = request.cookies.get('accessToken')?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as UserPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}
