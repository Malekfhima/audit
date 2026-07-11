import { riskRepository } from './risk.repository';
import { CreateRiskDto, UpdateRiskDto, RiskFilters } from './risk.types';
import { NotFoundError, BadRequestError } from '../../core/http/httpError';
import { PaginationParams, createPaginationResult } from '../../core/utils/pagination';
import { IRisk, Risk } from './risk.model';
import { Site } from '../sites/site.model';
import { Process } from '../processes/process.model';
import { User } from '../users/user.model';

class RiskService {
  async createRisk(dto: CreateRiskDto): Promise<IRisk> {
    if (dto.siteId) {
      const site = await Site.findById(dto.siteId);
      if (!site) throw new NotFoundError('Site not found');
    }

    if (dto.processId) {
      const process = await Process.findById(dto.processId);
      if (!process) throw new NotFoundError('Process not found');
    }

    const owner = await User.findById(dto.ownerId);
    if (!owner) throw new NotFoundError('Owner user not found');

    const identifier = await User.findById(dto.identifiedById);
    if (!identifier) throw new NotFoundError('Identifier user not found');

    if (dto.probability < 1 || dto.probability > 5) {
      throw new BadRequestError('Probability must be between 1 and 5');
    }

    if (dto.impact < 1 || dto.impact > 5) {
      throw new BadRequestError('Impact must be between 1 and 5');
    }

    const risk = await riskRepository.create(dto);
    return risk;
  }

  async getRisk(id: string): Promise<IRisk> {
    const risk = await riskRepository.findById(id);
    if (!risk) throw new NotFoundError('Risk not found');
    return risk;
  }

  async updateRisk(id: string, dto: UpdateRiskDto): Promise<IRisk> {
    const risk = await riskRepository.findById(id);
    if (!risk) throw new NotFoundError('Risk not found');

    if (dto.siteId) {
      const site = await Site.findById(dto.siteId);
      if (!site) throw new NotFoundError('Site not found');
    }

    if (dto.processId) {
      const process = await Process.findById(dto.processId);
      if (!process) throw new NotFoundError('Process not found');
    }

    if (dto.ownerId) {
      const user = await User.findById(dto.ownerId);
      if (!user) throw new NotFoundError('Owner user not found');
    }

    if (dto.probability !== undefined && (dto.probability < 1 || dto.probability > 5)) {
      throw new BadRequestError('Probability must be between 1 and 5');
    }

    if (dto.impact !== undefined && (dto.impact < 1 || dto.impact > 5)) {
      throw new BadRequestError('Impact must be between 1 and 5');
    }

    const updated = await riskRepository.update(id, dto);
    if (!updated) throw new NotFoundError('Risk not found');
    return updated;
  }

  async deleteRisk(id: string): Promise<void> {
    const risk = await riskRepository.findById(id);
    if (!risk) throw new NotFoundError('Risk not found');

    if (risk.status === 'MITIGATING' || risk.status === 'MONITORING') {
      throw new BadRequestError('Cannot delete risks that are being mitigated or monitored');
    }

    await riskRepository.delete(id);
  }

  async getAllRisks(filters: RiskFilters, pagination: PaginationParams) {
    const risks = await riskRepository.find(filters, pagination);
    const total = await riskRepository.count(filters);
    return createPaginationResult(risks, total, pagination);
  }

  async assessRisk(id: string, probability: number, impact: number): Promise<IRisk> {
    const risk = await riskRepository.findById(id);
    if (!risk) throw new NotFoundError('Risk not found');

    if (probability < 1 || probability > 5) {
      throw new BadRequestError('Probability must be between 1 and 5');
    }

    if (impact < 1 || impact > 5) {
      throw new BadRequestError('Impact must be between 1 and 5');
    }

    const updated = await riskRepository.update(id, {
      probability,
      impact,
      status: 'ASSESSED' as any,
    });
    if (!updated) throw new NotFoundError('Risk not found');
    return updated;
  }

  async addMitigationPlan(id: string, mitigationPlan: string, contingencyPlan?: string): Promise<IRisk> {
    const risk = await riskRepository.findById(id);
    if (!risk) throw new NotFoundError('Risk not found');

    const updated = await riskRepository.updateMitigation(id, mitigationPlan, contingencyPlan);
    if (!updated) throw new NotFoundError('Risk not found');
    return updated;
  }

  async updateResidualRisk(id: string, residualProbability: number, residualImpact: number): Promise<IRisk> {
    const risk = await riskRepository.findById(id);
    if (!risk) throw new NotFoundError('Risk not found');

    if (residualProbability < 1 || residualProbability > 5) {
      throw new BadRequestError('Residual probability must be between 1 and 5');
    }

    if (residualImpact < 1 || residualImpact > 5) {
      throw new BadRequestError('Residual impact must be between 1 and 5');
    }

    const updated = await riskRepository.updateResidualRisk(id, residualProbability, residualImpact);
    if (!updated) throw new NotFoundError('Risk not found');
    return updated;
  }

  async updateStatus(id: string, status: string): Promise<IRisk> {
    const risk = await riskRepository.findById(id);
    if (!risk) throw new NotFoundError('Risk not found');

    const updated = await riskRepository.updateStatus(id, status);
    if (!updated) throw new NotFoundError('Risk not found');
    return updated;
  }

  async assignOwner(id: string, ownerId: string): Promise<IRisk> {
    const risk = await riskRepository.findById(id);
    if (!risk) throw new NotFoundError('Risk not found');

    const user = await User.findById(ownerId);
    if (!user) throw new NotFoundError('Owner user not found');

    const updated = await riskRepository.update(id, { ownerId });
    if (!updated) throw new NotFoundError('Risk not found');
    return updated;
  }

  async getRiskMatrix() {
    const allRisks = await Risk.find({}).select('probability impact riskLevel');
    const matrix: any = {};

    for (let p = 1; p <= 5; p++) {
      matrix[p] = {};
      for (let i = 1; i <= 5; i++) {
        matrix[p][i] = {
          count: 0,
          risks: [],
        };
      }
    }

    allRisks.forEach((risk: any) => {
      const p = risk.probability;
      const i = risk.impact;
      if (matrix[p] && matrix[p][i]) {
        matrix[p][i].count++;
        matrix[p][i].risks.push({
          id: risk._id,
          riskNumber: risk.riskNumber,
          title: risk.title,
          riskLevel: risk.riskLevel,
        });
      }
    });

    return matrix;
  }

  async getRisksByLevel(level: string): Promise<IRisk[]> {
    if (level === 'HIGH') {
      return await riskRepository.getHighRisks();
    } else if (level === 'CRITICAL') {
      return await riskRepository.getCriticalRisks();
    }
    throw new BadRequestError('Invalid risk level. Use HIGH or CRITICAL');
  }

  async getRisksByOwner(ownerId: string): Promise<IRisk[]> {
    return await riskRepository.getRisksByOwner(ownerId);
  }

  async getRisksNeedingReview(): Promise<IRisk[]> {
    return await riskRepository.getRisksNeedingReview();
  }

  async getRiskStatistics() {
    const identified = await riskRepository.count({ status: 'IDENTIFIED' as any });
    const assessed = await riskRepository.count({ status: 'ASSESSED' as any });
    const mitigating = await riskRepository.count({ status: 'MITIGATING' as any });
    const monitoring = await riskRepository.count({ status: 'MONITORING' as any });
    const closed = await riskRepository.count({ status: 'CLOSED' as any });

    const low = await riskRepository.count({ riskLevel: 'LOW' as any });
    const medium = await riskRepository.count({ riskLevel: 'MEDIUM' as any });
    const high = await riskRepository.count({ riskLevel: 'HIGH' as any });
    const critical = await riskRepository.count({ riskLevel: 'CRITICAL' as any });

    return {
      byStatus: { identified, assessed, mitigating, monitoring, closed },
      byLevel: { low, medium, high, critical },
      total: identified + assessed + mitigating + monitoring + closed,
    };
  }

  async linkRiskToEntity(riskId: string, linkedEntityType: string, linkedEntityId: string, linkType: string, notes?: string) {
    const risk = await riskRepository.findById(riskId);
    if (!risk) throw new NotFoundError('Risk not found');

    const link = await riskRepository.createLink(riskId, linkedEntityType, linkedEntityId, linkType, notes);
    return link;
  }

  async unlinkRisk(linkId: string) {
    const deleted = await riskRepository.deleteLink(linkId);
    if (!deleted) throw new NotFoundError('Risk link not found');
  }

  async getRiskLinks(riskId: string) {
    const risk = await riskRepository.findById(riskId);
    if (!risk) throw new NotFoundError('Risk not found');

    return await riskRepository.findLinksByRisk(riskId);
  }

  async getEntityLinks(linkedEntityType: string, linkedEntityId: string) {
    return await riskRepository.findLinksByEntity(linkedEntityType, linkedEntityId);
  }
}

export const riskService = new RiskService();
