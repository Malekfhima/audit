import { Request, Response } from 'express';
import asyncHandler from '../../core/http/asyncHandler';
import { authService } from './auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.register(req.body);
  res.status(201).json({ success: true, data });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.login(req.body);
  res.json({ success: true, data });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.refreshTokens(req.body.refreshToken);
  res.json({ success: true, data });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken);
  res.json({ success: true, message: 'Logged out successfully' });
});

export const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  await authService.logoutAll(req.user.id);
  res.json({ success: true, message: 'Logged out from all devices' });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.changePassword(req.user.id, req.body);
  res.json({ success: true, message: 'Password changed successfully' });
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: req.user });
});
