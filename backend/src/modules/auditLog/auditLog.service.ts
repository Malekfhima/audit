import { AuditLogDocument, AuditLogSeverity } from './auditLog.model';
import { AuditLogRepository } from './auditLog.repository';

class AuditLogService {
  private repository: AuditLogRepository;

  constructor() {
    this.repository = new AuditLogRepository();
  }

  async logAction(
    action: string,
    entityType?: string,
    entityId?: string,
    performedById?: string,
    changes?: { before?: any; after?: any },
    metadata?: Record<string, any>,
    severity: AuditLogSeverity = 'INFO',
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuditLogDocument> {
    return await this.repository.create({
      action,
      entityType,
      entityId: entityId as any,
      performedById: performedById as any,
      changes,
      metadata,
      severity,
      ipAddress,
      userAgent,
    });
  }

  async getLogs(filters: any, pagination: any) {
    const logs = await this.repository.find(filters, pagination);
    const total = await this.repository.count(filters);
    return { logs, total, page: pagination.page || 1, limit: pagination.limit || 10 };
  }

  async getEntityHistory(entityType: string, entityId: string, pagination: any) {
    return await this.repository.findByEntity(entityType, entityId);
  }

  async getUserActivity(userId: string, dateRange?: { from?: Date; to?: Date }) {
    return await this.repository.findByUser(userId, dateRange);
  }

  async getSecurityLogs(filters: any) {
    return await this.repository.find({ ...filters, severity: 'WARNING' }, {});
  }

  async cleanupOldLogs(retentionDays: number) {
    return await this.repository.deleteOld(retentionDays);
  }

  async logUserCreated(userId: string, performedById: string) {
    return await this.logAction('USER_CREATED', 'User', userId, performedById, undefined, undefined, 'INFO');
  }

  async logUserUpdated(userId: string, changes: any, performedById: string) {
    return await this.logAction('USER_UPDATED', 'User', userId, performedById, changes, undefined, 'INFO');
  }

  async logAuditCreated(auditId: string, performedById: string) {
    return await this.logAction('AUDIT_CREATED', 'Audit', auditId, performedById, undefined, undefined, 'INFO');
  }

  async logAuditCompleted(auditId: string, performedById: string) {
    return await this.logAction('AUDIT_COMPLETED', 'Audit', auditId, performedById, undefined, undefined, 'INFO');
  }

  async logNCCreated(ncId: string, performedById: string) {
    return await this.logAction('NC_CREATED', 'NonConformity', ncId, performedById, undefined, undefined, 'WARNING');
  }

  async logNCClosed(ncId: string, performedById: string) {
    return await this.logAction('NC_CLOSED', 'NonConformity', ncId, performedById, undefined, undefined, 'INFO');
  }

  async logLoginAttempt(userId: string, success: boolean, ipAddress?: string, userAgent?: string) {
    const severity = success ? 'INFO' : 'WARNING';
    return await this.logAction(
      success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILURE',
      'User',
      userId,
      userId,
      undefined,
      { success },
      severity,
      ipAddress,
      userAgent
    );
  }

  async logPermissionChange(userId: string, changes: any, performedById: string) {
    return await this.logAction('PERMISSION_CHANGED', 'User', userId, performedById, changes, undefined, 'WARNING');
  }
}

export const auditLogService = new AuditLogService();
