export interface PageSlice<T> {
    items: T[];
    total: number;
}
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export interface PaginatedResult<T> {
    data: T[];
    meta: PaginationMeta;
}
export declare function paginate<T>(items: T[], total: number, page: number, limit: number): PaginatedResult<T>;
