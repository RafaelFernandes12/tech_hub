import { useQuery } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { TableData } from "../components/TableData";
import { products } from "../models/products";
import { findAllProducts } from "../operations/products";
import { productCollums } from "../utils/collums";
import { getQueryParams } from "../utils/getParams";

export function ProductsPrint(){

    const product = getQueryParams('product')
    const category = getQueryParams('category')
    const manufacturer = getQueryParams('manufacturer')
    const qtd = getQueryParams('qtd')
    const price = getQueryParams('price') 
    const totalValue = getQueryParams('totalValue') 
  
    const { data } = useQuery<products[]>({
        queryKey: ["products", product, category, manufacturer, price, qtd, totalValue],
        queryFn: () => findAllProducts({name: product, category, manufacturer, price, qtd, totalValue})
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
    const totalQtd = useMemo(() => products.reduce((sum, sell) => sum + sell.qtd, 0), [products]);
    const totalPrice = useMemo(() => products.reduce((sum, sell) => sum + sell.totalValue, 0), [products]);
    return (
        <div className="w-full h-full">
        <button onClick={() => reactToPrintFn()} className="btn btn-primary float-end absolute">Imprimir PDF</button>
        <div ref={contentRef} className="flex items-center flex-col justify-center">
            <h1 className="text-2xl font-bold m-5">TechHub</h1>
            <TableData table={table}>
            <tr>
            <th colSpan={4}></th>
            <th className="text-center text-xl">Despesas: R${totalPrice}</th>
            <th className="text-center text-xl">Quantidade total: {totalQtd}</th>
          </tr>
        </TableData>
            </div>
        </div>
    )
}