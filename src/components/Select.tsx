import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { capitalizeFirstLetter } from "../utils/capitalizeWord";

interface SelectProps {
  title: string
  apiName: string
  apiCall: () => Promise<string[]>;
}

export function Select(props: SelectProps) {
  const navigate = useNavigate();
  
  const { n } = useParams<{ n: string }>()
  const pageNumber = n ? parseInt(n) : 1

  const { data, isLoading, isError } = useQuery<string[]>({
    queryKey: [`products/${props.apiName}`],
    queryFn: () => props.apiCall(),
  });

  const options = data ? data : [];

  const handleNavigate = (query: string, location: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(query, location); 
    navigate(`/products/${pageNumber}/?${params.toString()}`); 
  };

  if (isLoading) return <p>Espere um minuto</p>;
  if (isError) return <p>Um erro ocorreu, tente novamente mais tarde</p>;

  return (
    <select
      className="select select-bordered w-full max-w-xs"
      onChange={(e) => handleNavigate(props.apiName, e.target.value)}
    >
      <option value=''>{props.apiName}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {capitalizeFirstLetter(option)}
        </option>
      ))}
    </select>
  );
}
