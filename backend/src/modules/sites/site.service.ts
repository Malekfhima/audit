import { siteRepository } from './site.repository';
import { CreateSiteDto, UpdateSiteDto, SiteFilters } from './site.types';
import { NotFoundError, ConflictError } from '../../core/http/httpError';
import { PaginationParams, createPaginationResult } from '../../core/utils/pagination';
import { ISite } from './site.model';
import { User } from '../users/user.model';

class SiteService {
  async createSite(dto: CreateSiteDto): Promise<ISite> {
    const existing = await siteRepository.findByCode(dto.code);
    if (existing) throw new ConflictError('Site code already exists');

    if (dto.siteManagerId) {
      const manager = await User.findById(dto.siteManagerId);
      if (!manager) throw new NotFoundError('Site manager not found');
    }

    const site = await siteRepository.create(dto);
    return site;
  }

  async getSite(id: string): Promise<ISite> {
    const site = await siteRepository.findById(id);
    if (!site) throw new NotFoundError('Site not found');
    return site;
  }

  async updateSite(id: string, dto: UpdateSiteDto): Promise<ISite> {
    const site = await siteRepository.findById(id);
    if (!site) throw new NotFoundError('Site not found');

    if (dto.code) {
      const existing = await siteRepository.findByCode(dto.code);
      if (existing && existing._id.toString() !== id) {
        throw new ConflictError('Site code already exists');
      }
    }

    if (dto.siteManagerId) {
      const manager = await User.findById(dto.siteManagerId);
      if (!manager) throw new NotFoundError('Site manager not found');
    }

    const updated = await siteRepository.update(id, dto);
    if (!updated) throw new NotFoundError('Site not found');
    return updated;
  }

  async deleteSite(id: string): Promise<void> {
    const site = await siteRepository.findById(id);
    if (!site) throw new NotFoundError('Site not found');

    await siteRepository.delete(id);
  }

  async getAllSites(filters: SiteFilters, pagination: PaginationParams) {
    const sites = await siteRepository.find(filters, pagination);
    const total = await siteRepository.count(filters);
    return createPaginationResult(sites, total, pagination);
  }

  async activateSite(id: string): Promise<ISite> {
    const site = await siteRepository.findById(id);
    if (!site) throw new NotFoundError('Site not found');

    const updated = await siteRepository.update(id, { isActive: true });
    if (!updated) throw new NotFoundError('Site not found');
    return updated;
  }

  async deactivateSite(id: string): Promise<ISite> {
    const site = await siteRepository.findById(id);
    if (!site) throw new NotFoundError('Site not found');

    const updated = await siteRepository.update(id, { isActive: false });
    if (!updated) throw new NotFoundError('Site not found');
    return updated;
  }
}

export const siteService = new SiteService();
