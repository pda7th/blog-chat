// src/types/api-envelope.ts

/** ===== Error ===== */
export interface ApiErrorEnvelope {
  success: false;
  error: {
    message: string;
    details?: string;
  };
}

/** ===== Success: single payload ===== */
export interface ApiResponseEnvelope<T> {
  success: true;
  data: T;
}

/** ===== Page-based pagination ===== */
export interface ApiPaginationResponseEnvelope<T> {
  success: true;
  data: {
    items: T[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

/** ===== Cursor-based pagination ===== */
export interface ApiCursorPaginationResponseEnvelope<T> {
  success: true;
  data: {
    items: T[];
    pagination: {
      limit: number;
      nextCursor: string | null;
      hasNext: boolean;
    };
  };
}

/** ===== Unions ===== */
export type ApiEnvelope<T> = ApiResponseEnvelope<T> | ApiErrorEnvelope;

export type ApiPaginationEnvelope<T> = ApiPaginationResponseEnvelope<T> | ApiErrorEnvelope;

export type ApiCursorPaginationEnvelope<T> = ApiCursorPaginationResponseEnvelope<T> | ApiErrorEnvelope;

/** (선택) 페이지/커서 둘 중 무엇을 쓸지 유연하게 받는 경우 */
export type ApiListEnvelope<T> =
  | ApiPaginationResponseEnvelope<T>
  | ApiCursorPaginationResponseEnvelope<T>
  | ApiErrorEnvelope;
