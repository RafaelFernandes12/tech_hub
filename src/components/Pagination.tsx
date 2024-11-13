import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getPageParam } from "../utils/getParams";

interface PaginationProps {
  data: any[]
  queryKey: string;
}

export function Pagination({ data, queryKey }: PaginationProps) {
  const { n } = getPageParam();
  const pageNumber = n ? parseInt(n) : 1;
  const location = useLocation();
  const navigate = useNavigate();
  const currentSearchParams = new URLSearchParams(location.search);

  const dataSize = data ? Math.ceil(data.length / 20) : 1;

  useEffect(() => {
    if (pageNumber > dataSize && dataSize > 0) {
      const nearestPage = Math.min(pageNumber, dataSize);
      navigate(`/${queryKey}/${nearestPage}?${currentSearchParams.toString()}`);
    }
  }, [dataSize, pageNumber, currentSearchParams, navigate, queryKey]);

  return (
    <div className="join flex items-center justify-center m-4 w-full">
      {Array.from({ length: dataSize }, (_, index) => {
        const page = index + 1;
        const linkTo = `/${queryKey}/${page}?${currentSearchParams.toString()}`;

        return (
          <Link
            to={linkTo}
            key={page}
            className={`join-item btn btn-lg ${page === pageNumber ? "btn-active" : ""}`}
          >
            {page}
          </Link>
        );
      })}
    </div>
  );
}
