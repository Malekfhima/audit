export interface CreateSiteDto {
  name: string;
  code: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  siteManagerId?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface UpdateSiteDto {
  name?: string;
  code?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  siteManagerId?: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive?: boolean;
}

export interface SiteResponse {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  siteManagerId: string;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteFilters {
  isActive?: boolean;
  city?: string;
  country?: string;
  siteManagerId?: string;
  search?: string;
}
