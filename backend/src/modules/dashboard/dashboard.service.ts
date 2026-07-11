import { DashboardStats, DashboardFilters, TimeSeriesData } from './dashboard.types';
import { Audit } from '../audits/audit.model';
import { NonConformity } from '../nonConformities/nonConformity.model';
import { CorrectiveAction } from '../correctiveActions/correctiveAction.model';
import { Risk } from '../risks/risk.model';
import { LegalCompliance } from '../legal/legalCompliance.model';

class DashboardService {
  async getOverviewStats(filters: DashboardFilters): Promise<DashboardStats> {
    const auditQuery = this.buildAuditQuery(filters);
    const ncQuery = this.buildNCQuery(filters);
    const actionQuery = await this.buildActionQuery(filters);
    const riskQuery = this.buildRiskQuery(filters);
    const complianceQuery = this.buildComplianceQuery(filters);

    const [
      totalAudits,
      plannedAudits,
      inProgressAudits,
      completedAudits,
      thisMonthAudits,
      totalNCs,
      openNCs,
      closedNCs,
      majorNCs,
      minorNCs,
      observationNCs,
      totalActions,
      pendingActions,
      overdueActions,
      completedActions,
      totalRisks,
      lowRisks,
      mediumRisks,
      highRisks,
      criticalRisks,
      compliant,
      nonCompliant,
      pending,
    ] = await Promise.all([
      Audit.countDocuments(auditQuery),
      Audit.countDocuments({ ...auditQuery, status: 'PLANNED' }),
      Audit.countDocuments({ ...auditQuery, status: 'IN_PROGRESS' }),
      Audit.countDocuments({ ...auditQuery, status: 'COMPLETED' }),
      this.countThisMonth(Audit, auditQuery),
      NonConformity.countDocuments(ncQuery),
      NonConformity.countDocuments({ ...ncQuery, status: { $in: ['OPEN', 'IN_PROGRESS'] } }),
      NonConformity.countDocuments({ ...ncQuery, status: 'CLOSED' }),
      NonConformity.countDocuments({ ...ncQuery, severity: 'MAJOR' }),
      NonConformity.countDocuments({ ...ncQuery, severity: 'MINOR' }),
      NonConformity.countDocuments({ ...ncQuery, severity: 'OBSERVATION' }),
      CorrectiveAction.countDocuments(actionQuery),
      CorrectiveAction.countDocuments({ ...actionQuery, status: 'PENDING' }),
      this.countOverdue(CorrectiveAction, actionQuery),
      CorrectiveAction.countDocuments({ ...actionQuery, status: 'COMPLETED' }),
      Risk.countDocuments(riskQuery),
      Risk.countDocuments({ ...riskQuery, riskLevel: 'LOW' }),
      Risk.countDocuments({ ...riskQuery, riskLevel: 'MEDIUM' }),
      Risk.countDocuments({ ...riskQuery, riskLevel: 'HIGH' }),
      Risk.countDocuments({ ...riskQuery, riskLevel: 'CRITICAL' }),
      LegalCompliance.countDocuments({ ...complianceQuery, complianceStatus: 'COMPLIANT' }),
      LegalCompliance.countDocuments({ ...complianceQuery, complianceStatus: 'NON_COMPLIANT' }),
      LegalCompliance.countDocuments({ ...complianceQuery, complianceStatus: 'PENDING_ASSESSMENT' }),
    ]);

    return {
      audits: {
        total: totalAudits,
        planned: plannedAudits,
        inProgress: inProgressAudits,
        completed: completedAudits,
        thisMonth: thisMonthAudits,
      },
      nonConformities: {
        total: totalNCs,
        open: openNCs,
        closed: closedNCs,
        bySeverity: {
          major: majorNCs,
          minor: minorNCs,
          observation: observationNCs,
        },
      },
      correctiveActions: {
        total: totalActions,
        pending: pendingActions,
        overdue: overdueActions,
        completed: completedActions,
      },
      risks: {
        total: totalRisks,
        byLevel: {
          low: lowRisks,
          medium: mediumRisks,
          high: highRisks,
          critical: criticalRisks,
        },
      },
      compliance: {
        compliant,
        nonCompliant,
        pending,
      },
    };
  }

  async getTimeSeriesData(metric: string, dateRange: { from: Date; to: Date }, filters: DashboardFilters): Promise<TimeSeriesData[]> {
    const data: TimeSeriesData[] = [];
    const currentDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      let count = 0;

      if (metric === 'audits') {
        count = await Audit.countDocuments({
          createdAt: { $gte: currentDate, $lt: new Date(currentDate.getTime() + 86400000) },
          ...this.buildAuditQuery(filters),
        });
      } else if (metric === 'nonConformities') {
        count = await NonConformity.countDocuments({
          createdAt: { $gte: currentDate, $lt: new Date(currentDate.getTime() + 86400000) },
          ...this.buildNCQuery(filters),
        });
      }

      data.push({ date: dateStr, value: count });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }

  async getTopIssues(filters: DashboardFilters) {
    const actionQuery = await this.buildActionQuery(filters);
    const overdueActions = await CorrectiveAction.find({
      ...actionQuery,
      dueDate: { $lt: new Date() },
      status: { $ne: 'COMPLETED' },
    })
      .populate('nonConformityId', 'ncNumber description')
      .limit(10);

    const criticalRisks = await Risk.find({
      ...this.buildRiskQuery(filters),
      riskLevel: 'CRITICAL',
      status: { $ne: 'CLOSED' },
    })
      .populate('ownerId', 'firstName lastName email')
      .limit(10);

    return {
      overdueActions,
      criticalRisks,
    };
  }

  private buildAuditQuery(filters: DashboardFilters): any {
    const query: any = {};
    if (filters.siteId) query.siteId = filters.siteId;
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = filters.startDate;
      if (filters.endDate) query.createdAt.$lte = filters.endDate;
    }
    return query;
  }

  private buildNCQuery(filters: DashboardFilters): any {
    const query: any = {};
    if (filters.siteId) query.siteId = filters.siteId;
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = filters.startDate;
      if (filters.endDate) query.createdAt.$lte = filters.endDate;
    }
    return query;
  }

  private async buildActionQuery(filters: DashboardFilters): Promise<any> {
    const query: any = {};
    if (filters.siteId) {
      query.nonConformityId = { $in: await NonConformity.find({ siteId: filters.siteId }).distinct('_id') };
    }
    if (filters.userId) query.responsibleId = filters.userId;
    return query;
  }

  private buildRiskQuery(filters: DashboardFilters): any {
    const query: any = {};
    if (filters.siteId) query.siteId = filters.siteId;
    if (filters.userId) query.ownerId = filters.userId;
    return query;
  }

  private buildComplianceQuery(filters: DashboardFilters): any {
    const query: any = {};
    if (filters.siteId) query.siteId = filters.siteId;
    return query;
  }

  private async countThisMonth(model: any, baseQuery: any): Promise<number> {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return await model.countDocuments({
      ...baseQuery,
      createdAt: { $gte: firstDay },
    });
  }

  private async countOverdue(model: any, baseQuery: any): Promise<number> {
    return await model.countDocuments({
      ...baseQuery,
      dueDate: { $lt: new Date() },
      status: { $ne: 'COMPLETED' },
    });
  }
}

export const dashboardService = new DashboardService();
