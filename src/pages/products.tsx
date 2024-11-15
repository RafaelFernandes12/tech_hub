import { useQuery } from "@tanstack/react-query";
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
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
import { ToastSuccess } from "../utils/ToastSuccess";

const categoryTitle = 'category'
const manufacturerTitle = 'manufacturer'
const totalValuesRanges = [500, 1000, 2000, 5000, 10000, 15000, 20000, 30000, 40000, 50000]
const priceRanges = [1, 5, 10, 20, 50, 100, 300, 500, 700, 900, 1000]
const qtdRanges = [1, 2, 5, 7, 10, 20, 30, 50, 70, 90, 100]

export default function Products() {

  const [sorting, setSorting] = useState<SortingState>([]);
  const pageNumber = getPageParam()    
  const location = useLocation()
  const product = getQueryParams('product')
  const category = getQueryParams('category')
  const manufacturer = getQueryParams('manufacturer')
  const qtd = getQueryParams('qtd')
  const price = getQueryParams('price') 
  const totalValue = getQueryParams('totalValue') 

    const { data, isLoading } = useQuery<products[]>({
        queryKey: ["products", product, category, manufacturer, price, qtd, totalValue, pageNumber],
        queryFn: () => queryAllProducts({name:product, category, manufacturer, price, qtd, totalValue, n: pageNumber})
    })
    const { data: dataPagination } = useQuery<products[]>({
        queryKey: ["products", product, category, manufacturer, price, qtd, totalValue],
        queryFn: () => findAllProducts({name: product, category, manufacturer, price, qtd, totalValue})
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

    const totalQtd = useMemo(() => products.reduce((sum, sell) => sum + sell.qtd, 0), [products]);
    const totalPrice = useMemo(() => products.reduce((sum, sell) => sum + sell.totalValue, 0), [products]);

    if (isLoading) return <p>carregando...</p>;
    return (
        <div>
            <div className="flex gap-4 w-full items-center justify-between my-10">
              <SearchBar to="products"/>
              <Select title={categoryTitle} page='products'>
                <option>Categoria</option>
                {(categories || []).map((option) => (
                    <option key={option} value={option}>
                    {capitalizeFirstLetter(option)}
                  </option>
                ))}
              </Select>
              <Select title={manufacturerTitle} page='products'>
                <option>Fabricante</option>
                {(manufacturers || []).map((option) => (
                  <option key={option} value={option}>
                  {capitalizeFirstLetter(option)}
                </option>
              ))}
            </Select>
              <Select title='qtd' page='products'>
                <option>Quantidade</option>
                {(qtdRanges || []).map((option) => (
                    <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              <Select title="price" page='products'>
                <option>Preço</option>
                {(priceRanges || []).map((option) => (
                    <option key={option} value={option}>
                    R${option}
                  </option>
                ))}
              </Select>
              <Select title="totalValue" page='products'>
                <option>Valor total</option>
                {totalValuesRanges.map((option) => (
                    <option key={option} value={option}>
                    R${option}
                  </option>
                ))}
              </Select>
            <Link to={`/products/${pageNumber}`} className='btn btn-primary'>Limpar</Link >
            <Button onClick={() => create10Products().then(() => ToastSuccess({message: "Produtos criados com sucesso!"}))} title='Criar 10 produtos aleatórios'/>
            <PdfButton to={`/productPrint/${location.search}`} />
            </div>
            {products.length > 0 ?
              <TableData table={table}>
                <tr>
                  <th colSpan={4}></th>
                  <th className="text-xl text-center cursor-pointer">Preço total: R${totalPrice.toFixed(2)}</th>
                  <th className="text-xl text-center cursor-pointer">Quantidade total: {totalQtd}</th>
                </tr> 
              </TableData>
               : 
              <p className="m-auto flex items-center justify-center mt-32">Não há nenhum produto</p>
            }
            <Pagination data={productsPagination} queryKey="products"/>
            
        </div>
    );
}
