// ==============================================
// MODULE: AUDIT LOG - REPOSITORY LAYER
// ==============================================

import { AuditLog, AuditLogDocument, AuditLogSeverity } from './auditLog.model';
import { Types } from 'mongoose';

interface AuditLogFilters {
  entityType?: string;
  entityId?: string;
  performedById?: string;
  action?: string;
  severity?: AuditLogSeverity;
  dateRange?: { from?: Date; to?: Date };
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

export class AuditLogRepository {
  // Create a new audit log entry
  async create(data: Partial<AuditLogDocument>): Promise<AuditLogDocument> {
    const log = new AuditLog(data);
    return log.save();
  }

  // Get a log by ID
  async findById(id: string): Promise<AuditLogDocument | null> {
    return AuditLog.findById(id).populate('performedById').exec();
  }

  // Find logs with filters and pagination
  async find(filters: AuditLogFilters = {}, pagination: PaginationParams = {}): Promise<AuditLogDocument[]> {
    const query: any = {};
    if (filters.entityType) query.entityType = filters.entityType;
    if (filters.entityId) query.entityId = filters.entityId;
    if (filters.performedById) query.performedById = filters.performedById;
    if (filters.action) query.action = filters.action;
    if (filters.severity) query.severity = filters.severity;
    if (filters.dateRange) {
      query.performedAt = {};
      if (filters.dateRange.from) query.performedAt.$gte = filters.dateRange.from;
      if (filters.dateRange.to) query.performedAt.$lte = filters.dateRange.to;
    }

    const page = pagination.page && pagination.page > 0 ? pagination.page : 1;
    const limit = pagination.limit && pagination.limit > 0 ? pagination.limit : 10;
    const skip = (page - 1) * limit;

    return AuditLog.find(query)
      .populate('performedById')
      .sort({ performedAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  // Count logs matching filters
  async count(filters: AuditLogFilters = {}): Promise<number> {
    const query: any = {};
    if (filters.entityType) query.entityType = filters.entityType;
    if (filters.entityId) query.entityId = filters.entityId;
    if (filters.performedById) query.performedById = filters.performedById;
    if (filters.action) query.action = filters.action;
    if (filters.severity) query.severity = filters.severity;
    if (filters.dateRange) {
      query.performedAt = {};
      if (filters.dateRange.from) query.performedAt.$gte = filters.dateRange.from;
      if (filters.dateRange.to) query.performedAt.$lte = filters.dateRange.to;
    }
    return AuditLog.countDocuments(query).exec();
  }

  // Get all logs for a specific entity
  async findByEntity(entityType: string, entityId: string): Promise<AuditLogDocument[]> {
    return AuditLog.find({ entityType, entityId }).populate('performedById').sort({ performedAt: -1 }).exec();
  }

  // Get logs performed by a specific user within optional date range
  async findByUser(userId: string, dateRange?: { from?: Date; to?: Date }): Promise<AuditLogDocument[]> {
    const query: any = { performedById: userId };
    if (dateRange) {
      query.performedAt = {};
      if (dateRange.from) query.performedAt.$gte = dateRange.from;
      if (dateRange.to) query.performedAt.$lte = dateRange.to;
    }
    return AuditLog.find(query).populate('performedById').sort({ performedAt: -1 }).exec();
  }

  // Delete logs older than X days (retention policy)
  async deleteOld(daysOld: number): Promise<{ deletedCount?: number }> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysOld);
    return AuditLog.deleteMany({ performedAt: { $lt: cutoff } }).exec();
  }
}
