export const generatePaginationMeta = (
  page: number,
  limit: number,
  total: number
) => {
  const pages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    pages,
    hasNext: page < pages,
    hasPrev: page > 1,
  };
};

export const createSuccessResponse = <T>(
  message: string,
  data?: T,
  statusCode: number = 200
) => {
  return {
    success: true,
    message,
    data,
    statusCode,
  };
};

export const createErrorResponse = (
  message: string,
  error?: string,
  statusCode: number = 400
) => {
  return {
    success: false,
    message,
    error,
    statusCode,
  };
};

export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};