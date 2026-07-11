import { Request, Response } from 'express';
import asyncHandler from '../../core/http/asyncHandler';
import { userService } from './user.service';
import { parsePaginationParams } from '../../core/utils/pagination';
import { CreateUserDto, UpdateUserDto } from './user.types';

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const dto: CreateUserDto = req.body;
  const user = await userService.createUser(dto);
  res.status(201).json({ success: true, data: user });
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  res.json({ success: true, data: user });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const dto: UpdateUserDto = req.body;
  const user = await userService.updateUser(id, dto);
  res.json({ success: true, data: user });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await userService.deleteUser(id);
  res.json({ success: true, message: 'User deleted successfully' });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePaginationParams(req.query);
  const filters: any = {};

  if (req.query.role) filters.role = req.query.role;
  if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';
  if (req.query.search) filters.search = req.query.search;

  const result = await userService.getAllUsers(filters, pagination);
  res.json({ success: true, ...result });
});

export const activateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.activateUser(id);
  res.json({ success: true, data: user });
});

export const deactivateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.deactivateUser(id);
  res.json({ success: true, data: user });
});

export const changeUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = await userService.changeUserRole(id, role);
  res.json({ success: true, data: user });
});

export const getCurrentUserProfile = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: req.user });
});

export const updateCurrentUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const dto: UpdateUserDto = req.body;
  const user = await userService.updateUser(req.user._id, dto);
  res.json({ success: true, data: user });
});
