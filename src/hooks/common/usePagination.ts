import { DEFAULT_LIMIT, DEFAULT_OFFSET, LIMIT, OFFSET } from "@/constants";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PaginationParams {
  defaultLimit?: number;
  defaultOffset?: number;
}

interface PaginationReturn {
  limit: number;
  offset: number;
  page: number;
  handlePageChange: (newPage: number, newPageSize: number) => void;
}

export const usePagination = ({
  defaultLimit = DEFAULT_LIMIT,
  defaultOffset = DEFAULT_OFFSET,
}: PaginationParams = {}): PaginationReturn => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [limit, setLimit] = useState(
    Number(searchParams.get(LIMIT)) || defaultLimit
  );
  const [offset, setOffset] = useState(
    Number(searchParams.get(OFFSET)) || defaultOffset
  );

  const [page, setPage] = useState<number>(
    Math.floor(offset / limit) + 1
  );

  useEffect(() => {
    const updatedLimit = Number(searchParams.get(LIMIT)) || defaultLimit;
    const updatedOffset = Number(searchParams.get(OFFSET)) || defaultOffset;
    setLimit(updatedLimit);
    setOffset(updatedOffset);
    setPage(Math.floor(updatedOffset / updatedLimit) + 1);
  }, [searchParams, defaultLimit, defaultOffset]);

  const createQueryString = (newLimit: number, newOffset: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(LIMIT, newLimit.toString());
    params.set(OFFSET, newOffset.toString());
    return params.toString();
  };

  const handlePageChange = (newPage: number, newPageSize: number) => {
    const newOffset = (newPageSize == limit) ? (newPage - 1) * limit : 0;
    router.push(`${pathname}?${createQueryString(newPageSize, newOffset)}`);
  };

  return {
    limit,
    offset,
    page,
    handlePageChange,
  };
};
