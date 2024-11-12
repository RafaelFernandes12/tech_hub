import { useParams, useSearchParams } from "react-router-dom";

export function getQueryParams(param: string){
    const [searchParams, _] = useSearchParams();
    return searchParams.get(`${param}`)
}
export function getPageParam(){
    return useParams<{ n: string }>()
}
