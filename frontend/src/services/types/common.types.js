// Common types and interfaces for API responses

// Pagination response structure
export const PaginatedResponse = {
  data: [], // Array of items
  total: 0, // Total number of items
  page: 1, // Current page
  limit: 10, // Items per page
  totalPages: 0, // Total number of pages
  hasNext: false, // Has next page
  hasPrevious: false // Has previous page
};

// Standard API response structure
export const ApiResponse = {
  success: true,
  timestamp: '',
  statusCode: 200,
  message: '',
  data: null
};

// Error response structure
export const ErrorResponse = {
  success: false,
  timestamp: '',
  statusCode: 400,
  message: '',
  error: '',
  details: []
};