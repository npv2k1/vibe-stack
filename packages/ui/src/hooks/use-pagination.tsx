import { useCallback, useState } from 'react';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const usePagination = ({ initialPage = DEFAULT_PAGE, initialLimit = DEFAULT_LIMIT }) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const nextPage = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  }, []);

  const goToPage = useCallback((pageNumber: number) => {
    setPage(Math.max(pageNumber, 1));
  }, []);

  const changePageSize = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when page size changes
  }, []);

  return { page, setPage, limit, setLimit, nextPage, prevPage, goToPage, changePageSize };
};
