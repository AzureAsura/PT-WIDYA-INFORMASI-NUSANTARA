import type { RequestHandler } from 'express';
import * as usersService from './users.service.js';

export const getProfile: RequestHandler = async (_req, res) => {

  const user = await usersService.getProfile(res.locals.userId);

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.status(200).json({
    message: 'Profile retrieved',
    data: user
  });

};
