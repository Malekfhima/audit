import { Request, Response } from 'express';
import asyncHandler from '../../core/http/asyncHandler';
import auditEntryService from './auditEntry.service';
import { CreateAuditEntryDto, UpdateAuditEntryDto } from './auditEntry.types';

export const createAuditEntry = asyncHandler(async (req: Request, res: Response) => {
  const dto: CreateAuditEntryDto = req.body;
  const entry = await auditEntryService.createAuditEntry(dto);
  res.status(201).json({ success: true, data: entry });
});

export const createBulkAuditEntries = asyncHandler(async (req: Request, res: Response) => {
  const entries: CreateAuditEntryDto[] = req.body.entries;
  const created = await auditEntryService.createBulkEntries(entries);
  res.status(201).json({ success: true, data: created });
});

export const getEntriesByAudit = asyncHandler(async (req: Request, res: Response) => {
  const { auditId } = req.params;
  const filters: any = {};
  if (req.query.conformityStatus) filters.conformityStatus = req.query.conformityStatus;
  const entries = await auditEntryService.getEntriesByAudit(auditId, filters);
  res.json({ success: true, data: entries });
});

export const getEntryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const entry = await auditEntryService.getEntryById(id);
  res.json({ success: true, data: entry });
});

export const updateAuditEntry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const dto: UpdateAuditEntryDto = req.body;
  const updated = await auditEntryService.updateEntry(id, dto);
  res.json({ success: true, data: updated });
});

export const deleteAuditEntry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await auditEntryService.deleteEntry(id);
  res.json({ success: true, message: 'Entry deleted successfully' });
});

export const verifyAuditEntry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const entry = await auditEntryService.verifyEntry(id, req.user._id);
  res.json({ success: true, data: entry });
});

export const markAsVerified = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const entry = await auditEntryService.markAsVerified(id, req.user._id);
  res.json({ success: true, data: entry });
});

export const addEvidence = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { evidence, attachments } = req.body;
  const entry = await auditEntryService.addEvidence(id, evidence, attachments);
  res.json({ success: true, data: entry });
});

export const addEvidenceToEntry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { evidence, attachments } = req.body;
  const entry = await auditEntryService.addEvidence(id, evidence, attachments);
  res.json({ success: true, data: entry });
});

export const getAuditStatistics = asyncHandler(async (req: Request, res: Response) => {
  const { auditId } = req.params;
  const stats = await auditEntryService.getAuditStatistics(auditId);
  res.json({ success: true, data: stats });
});

export const getConformityStatistics = asyncHandler(async (req: Request, res: Response) => {
  const { auditId } = req.params;
  const stats = await auditEntryService.getConformityStatistics(auditId);
  res.json({ success: true, data: stats });
});
