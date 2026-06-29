export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}
export declare function parsePagination(page?: string, limit?: string, maxLimit?: number): PaginationParams;
