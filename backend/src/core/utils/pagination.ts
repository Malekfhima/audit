import config from '../../config/config';

export interface PaginationParams {
  page?: number;           // Current page (default: 1)
  limit?: number;          // Items per page (default: 10)
  sortBy?: string;         // Field to sort by (default: 'createdAt')
  sortOrder?: 'asc' | 'desc'; // Sort direction (default: 'desc')
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Parse and validate pagination parameters from request query
 */
export const parsePaginationParams = (query: any): PaginationParams => {
  const maxPageSize = config.pagination?.maxPageSize || 100;
  let page = Number(query.page) || 1;
  let limit = Number(query.limit) || config.pagination?.defaultPageSize || 10;
  let sortBy = query.sortBy || 'createdAt';
  let sortOrder: 'asc' | 'desc' = query.sortOrder === 'asc' ? 'asc' : 'desc';

  if (page < 1) page = 1;
  if (limit < 1) limit = 1;
  if (limit > maxPageSize) limit = maxPageSize;

  return { page, limit, sortBy, sortOrder };
};

/**
 * Calculate pagination metadata
 */
export const calculatePagination = (total: number, page: number, limit: number) => {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Generate Mongoose query options
 */
export const getPaginationOptions = (params: PaginationParams) => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = {};
  sort[params.sortBy || 'createdAt'] = params.sortOrder === 'asc' ? 1 : -1;

  return { skip, limit, sort };
};

/**
 * Create standardized pagination result
 */
export const createPaginationResult = <T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginationResult<T> => {
  const pagination = calculatePagination(total, params.page || 1, params.limit || 10);
  return { data, pagination };
};
