import { Link } from "react-router-dom";

export function NotFound(){
    return(
        <p className="flex items-center justify-center mt-40">
            Um erro ocorreu por favor, clique aqui para retornar para
            <Link to='/products/1' className="link line-clamp-1"> a pagina principal</Link>
        </p>
    )
}