import { useQuery } from "@tanstack/react-query";
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/Button";
import { Pagination } from "../components/Pagination";
import { PdfButton } from "../components/PdfButton";
import { SearchBar } from "../components/SearchBar";
import { Select } from "../components/Select";
import { TableData } from "../components/TableData";
import { products } from "../models/products";
import { create10Products, findAllCategories, findAllManufactures, findAllProducts, queryAllProducts } from "../operations/products";
import { capitalizeFirstLetter } from "../utils/capitalizeWord";
import { productCollums } from "../utils/collums";
import { getPageParam, getQueryParams } from "../utils/getParams";

const categoryTitle = 'category'
const manufacturerTitle = 'manufacturer'

export default function Products() {

  const [sorting, setSorting] = useState<SortingState>([]);
  const pageNumber = getPageParam()    
  const location = useLocation()
    const filters = {
        product: getQueryParams('product'),
        category: getQueryParams('category'),
        manufacturer: getQueryParams('manufacturer'),
        qtd: getQueryParams('qtd'),
        price: getQueryParams('price'),  
    };

    const { data, isLoading } = useQuery<products[]>({
        queryKey: ["products", filters.product, filters.category, filters.manufacturer, pageNumber],
        queryFn: () => queryAllProducts(filters.product, filters.category, filters.manufacturer, pageNumber)
    })
    const { data: dataPagination } = useQuery<products[]>({
        queryKey: ["products", filters.product, filters.category, filters.manufacturer],
        queryFn: () => findAllProducts(filters.product, filters.category, filters.manufacturer)
      })
      const { data: categories } = useQuery<string[]>({
        queryKey: ["/products/categories"],
        queryFn: () => findAllCategories()
      })
      const { data: manufacturers } = useQuery<string[]>({
        queryKey: ["products/manufacturers"],
        queryFn: () => findAllManufactures()
      })
      
    const products = data ? data : [];
    const productsPagination = dataPagination ? dataPagination : [];
    const table = useReactTable({
        data: products,
        columns: productCollums,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
          },
        
    });

    if (isLoading) return <p>carregando...</p>;
    return (
        <div>
            <div className="flex gap-4 w-full items-center justify-between my-10">
            <SearchBar />
            <Select title={categoryTitle} page='products'>
            <option value='category'>Categorias</option>
            {(categories || []).map((option) => (
              <option key={option} value={option}>
                {capitalizeFirstLetter(option)}
              </option>
            ))}
            </Select>
          <Select title={filters.manufacturer ? filters.manufacturer : manufacturerTitle} page='products'>
            {(manufacturers || []).map((option) => (
              <option key={option} value={option}>
                {capitalizeFirstLetter(option)}
              </option>
            ))}
          </Select>
          <Link to={`/products/${pageNumber}`} className='btn btn-primary'>Limpar</Link >
          <Button onClick={create10Products} title='Criar 10 produtos aleatórios'/>
          <PdfButton to={`/productPrint/${location.search}`} />
            </div>
            {products.length > 0 ?
              <TableData table={table}/> : 
              <p className="m-auto flex items-center justify-center mt-32">Não há nenhum produto</p>
            }
            <Pagination data={productsPagination} queryKey="products"/>
            
        </div>
    );
}
