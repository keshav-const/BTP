export const buildQuery = (filters: any, searchFields?: string[]) => {
  const query: any = {};

  // Handle text search
  if (filters.search && searchFields) {
    query.$or = searchFields.map(field => ({
      [field]: { $regex: filters.search, $options: 'i' }
    }));
    delete filters.search;
  }

  // Handle range filters
  Object.keys(filters).forEach(key => {
    if (key.includes('Min') && filters[key] !== undefined) {
      const field = key.replace('Min', '');
      query[field] = query[field] || {};
      query[field].$gte = filters[key];
    } else if (key.includes('Max') && filters[key] !== undefined) {
      const field = key.replace('Max', '');
      query[field] = query[field] || {};
      query[field].$lte = filters[key];
    } else if (filters[key] !== undefined) {
      query[key] = filters[key];
    }
  });

  return query;
};

export const buildSortQuery = (sort: string, order: 'asc' | 'desc' = 'desc') => {
  const sortQuery: any = {};
  sortQuery[sort] = order === 'asc' ? 1 : -1;
  return sortQuery;
};

export const paginate = (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  return { skip, limit };
};