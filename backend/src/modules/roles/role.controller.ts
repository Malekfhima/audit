import { Request, Response } from 'express';
import asyncHandler from '../../core/http/asyncHandler';
import { roleService } from './role.service';
import { parsePaginationParams } from '../../core/utils/pagination';
import { CreateRoleDto, UpdateRoleDto } from './role.types';

export const createRole = asyncHandler(async (req: Request, res: Response) => {
  const dto: CreateRoleDto = req.body;
  const role = await roleService.createRole(dto);
  res.status(201).json({ success: true, data: role });
});

export const getRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const role = await roleService.getRole(id);
  res.json({ success: true, data: role });
});

export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const dto: UpdateRoleDto = req.body;
  const role = await roleService.updateRole(id, dto);
  res.json({ success: true, data: role });
});

export const deleteRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await roleService.deleteRole(id);
  res.json({ success: true, message: 'Role deleted successfully' });
});

export const getAllRoles = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePaginationParams(req.query);
  const filters: any = {};

  if (req.query.name) filters.name = req.query.name;
  if (req.query.isSystemRole !== undefined) filters.isSystemRole = req.query.isSystemRole === 'true';

  const result = await roleService.getAllRoles(filters, pagination);
  res.json({ success: true, ...result });
});

export const assignPermissions = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { permissions } = req.body;
  const role = await roleService.assignPermissionsToRole(id, permissions);
  res.json({ success: true, data: role });
});

export const removePermissions = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { permissions } = req.body;
  const role = await roleService.removePermissionsFromRole(id, permissions);
  res.json({ success: true, data: role });
});

export const getRolePermissions = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const permissions = await roleService.getRolePermissions(id);
  res.json({ success: true, data: permissions });
});
