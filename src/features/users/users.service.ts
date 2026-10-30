import { prisma } from '../../lib/prisma.js';

export const getProfile = (id: string) => {
  return prisma.user.findUnique({ where: { id }, omit: { password: true } });
};
