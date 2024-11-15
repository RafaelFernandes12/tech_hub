import { useQuery } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { TableData } from "../components/TableData";
import { products } from "../models/products";
import { findAllProducts } from "../operations/products";
import { productCollums } from "../utils/collums";
import { getQueryParams } from "../utils/getParams";

export function ProductsPrint(){

    const filters = {
        product: getQueryParams('product'),
        category: getQueryParams('category'),
        manufacturer: getQueryParams('manufacturer'),
        qtd: getQueryParams('qtd'),
        price: getQueryParams('price'),  
    };

    const { data } = useQuery<products[]>({
        queryKey: ["products", filters.product, filters.category, filters.manufacturer],
        queryFn: () => findAllProducts(filters.product, filters.category, filters.manufacturer)
      })
      
    const products = data ? data : [];

    const table = useReactTable({
        data: products,
        columns: productCollums,
        getCoreRowModel: getCoreRowModel(),
        
    });
    const contentRef = useRef<HTMLTableElement>(null);
    const reactToPrintFn = useReactToPrint({
        contentRef,
    })
    return (
        <div className="w-full h-full">
        <button onClick={() => reactToPrintFn()} className="btn btn-primary float-end absolute">Imprimir PDF</button>
        <div ref={contentRef} className="flex items-center flex-col justify-center">
            <h1 className="text-2xl font-bold m-5">TechHub</h1>
            <TableData table={table}/>
            </div>
        </div>
    )
}