import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { getPageParam } from "../utils/getParams";

interface SelectProps {
  title: string | null
  children: ReactNode
  page: 'sells' | 'products' | 'productsTable'
}

export function Select(props: SelectProps) {
  const navigate = useNavigate();
  
  const pageNumber = getPageParam()

  const handleNavigate = (query: string | null, location: string) => {
    const params = new URLSearchParams(window.location.search);
    if(query){
      params.set(query, location); 
      navigate(`/${props.page}/${pageNumber}/?${params.toString()}`); 
    }
    else if(query == 'category') params.delete('category'); 
    else if(query == 'manufacturer') params.delete('manufacturer'); 
  };

  return (
    <select
      className="select select-bordered w-full max-w-xs"
      onChange={(e) => handleNavigate(props.title, e.target.value)}
    >
        {props.children}
    </select>
  );
}
