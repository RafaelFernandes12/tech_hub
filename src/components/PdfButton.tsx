import { Link } from "react-router-dom";

export function PdfButton({to} : {to: string}){
    return <Link to={to} className="btn btn-primary">Gerar PDF</Link>
}