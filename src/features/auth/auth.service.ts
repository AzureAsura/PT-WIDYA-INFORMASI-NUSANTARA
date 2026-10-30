import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { Prisma } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';

interface RegisterInput {
  name: string;
  email: string;
  gender: 'MALE' | 'FEMALE';
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const register = async ({ password, ...data }: RegisterInput) => {

  const hashedPassword = await bcrypt.hash(password, 10);

  try {

    return await prisma.user.create({
      
      data: { 
        ...data, 
        password: hashedPassword 
      },
      omit: { 
        password: true 
      },

    });

  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return null;
    }
    throw err;
  }
};

export const login = async ({ email, password }: LoginInput) => {

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return null;
  }

  return jwt.sign({ sub: user.id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  });
};
