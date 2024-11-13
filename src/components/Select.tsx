import { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface SelectProps {
  title: string
  children: ReactNode
  page: 'sells' | 'products'
}

export function Select(props: SelectProps) {
  const navigate = useNavigate();
  
  const { n } = useParams<{ n: string }>()
  const pageNumber = n ? parseInt(n) : 1

  const handleNavigate = (query: string, location: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(query, location); 
    navigate(`/${props.page}/${pageNumber}/?${params.toString()}`); 
  };

  return (
    <select
      className="select select-bordered w-full max-w-xs"
      onChange={(e) => handleNavigate(props.title, e.target.value)}
    >
      <option value=''>{props.title}</option>
        {props.children}
    </select>
  );
}
