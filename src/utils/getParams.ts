import { useParams, useSearchParams } from "react-router-dom";

export function getQueryParams(param: string){
    const [searchParams, _] = useSearchParams();
    return searchParams.get(`${param}`)
}
export function getPageParam(){
    const {n} = useParams<{ n: string }>()
    return n ? parseInt(n) : 1
}
