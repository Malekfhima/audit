import { Site, ISite } from './site.model';
import { CreateSiteDto, UpdateSiteDto, SiteFilters } from './site.types';
import { PaginationParams, getPaginationOptions } from '../../core/utils/pagination';

class SiteRepository {
  async create(data: CreateSiteDto): Promise<ISite> {
    const site = await Site.create(data);
    return site;
  }

  async findById(id: string): Promise<ISite | null> {
    return await Site.findById(id).populate('siteManagerId', 'firstName lastName email');
  }

  async findByCode(code: string): Promise<ISite | null> {
    return await Site.findOne({ code: code.toUpperCase() });
  }

  async update(id: string, data: UpdateSiteDto): Promise<ISite | null> {
    if (data.code) {
      data.code = data.code.toUpperCase();
    }
    return await Site.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('siteManagerId', 'firstName lastName email');
  }

  async delete(id: string): Promise<boolean> {
    const result = await Site.findByIdAndDelete(id);
    return !!result;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await Site.findByIdAndUpdate(id, { isActive: false }, { new: true });
    return !!result;
  }

  async find(filters: SiteFilters, pagination: PaginationParams): Promise<ISite[]> {
    const { skip, limit, sort } = getPaginationOptions(pagination);
    const query = this.buildQuery(filters);

    return await Site.find(query).populate('siteManagerId', 'firstName lastName email').skip(skip).limit(limit).sort(sort);
  }

  async count(filters: SiteFilters): Promise<number> {
    const query = this.buildQuery(filters);
    return await Site.countDocuments(query);
  }

  private buildQuery(filters: SiteFilters): any {
    const query: any = {};

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.city) {
      query.city = filters.city;
    }

    if (filters.country) {
      query.country = filters.country;
    }

    if (filters.siteManagerId) {
      query.siteManagerId = filters.siteManagerId;
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { code: { $regex: filters.search, $options: 'i' } },
        { city: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return query;
  }
}

export const siteRepository = new SiteRepository();
