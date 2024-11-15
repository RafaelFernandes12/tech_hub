import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getPageParam } from "../utils/getParams";

interface PaginationProps {
  data: any[];
  queryKey: string;
}

export function Pagination({ data, queryKey }: PaginationProps) {
  const pageNumber = getPageParam();
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

  const firstPageLink = `/${queryKey}/1?${currentSearchParams.toString()}`;
  const lastPageLink = `/${queryKey}/${dataSize}?${currentSearchParams.toString()}`;
  const previousPageLink = pageNumber > 1 ? `/${queryKey}/${pageNumber - 1}?${currentSearchParams.toString()}` : firstPageLink;
  const nextPageLink = pageNumber < dataSize ? `/${queryKey}/${pageNumber + 1}?${currentSearchParams.toString()}` : lastPageLink;

  return (
    <div className="join flex items-center justify-center m-4 w-full">
      <Link to={firstPageLink} className={`join-item btn ${pageNumber == 1 ? 'hidden' : ''}`}>
        «
      </Link>

      <Link to={previousPageLink} className={`join-item btn ${pageNumber === 1 ? "btn-disabled" : ""}`}>
        Anterior
      </Link>
        <button className="join-item btn">{pageNumber} de {dataSize}</button>
      <Link to={nextPageLink} className={`join-item btn ${pageNumber === dataSize ? "btn-disabled" : ""}`}>
        Próximo
      </Link>

      <Link to={lastPageLink} className={`join-item btn ${pageNumber == dataSize ? 'hidden' : ''}`}>
        »
      </Link>
    </div>
  );
}
