import { useQuery } from '@tanstack/react-query';
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { Pagination } from '../components/Pagination';
import { PdfButton } from '../components/PdfButton';
import { SearchBar } from '../components/SearchBar';
import { Select } from '../components/Select';
import { TableData } from '../components/TableData';
import { products } from '../models/products';
import { sells } from '../models/sells';
import { findAllProducts } from '../operations/products';
import { create10sells, findAllSells, queryAllSells } from '../operations/sells';
import { calculateStartDate } from '../utils/calculateStartDate';
import { sellsCollums } from '../utils/collums';
import { getPageParam, getQueryParams } from '../utils/getParams';
import { ToastSuccess } from '../utils/ToastSuccess';
import { NotFound } from './notFound';

const totalValuesRanges = [500, 1000, 2000, 5000, 10000, 15000, 20000, 30000, 40000, 50000]
const priceRanges = [1, 5, 10, 20, 50, 100, 300, 500, 700, 900, 1000]
const qtdRanges = [1, 2, 5, 7, 10, 20, 30, 50, 70, 90, 100]
const dateRanges = [
  { label: 'Ultima semana', value: 'lastWeek' },
  { label: 'Ultimo mês', value: 'lastMonth' },
  { label: 'Ultimos 3 meses', value: 'lastThreeMonths' },
  { label: 'Ultimo ano', value: 'lastYear' },
  { label: 'Ultimos 3 ano', value: 'lastThreeYear' },
];

export default function Sells() {
  const pageNumber = getPageParam()
  const product = getQueryParams('product');
  const totalValue = getQueryParams('totalValue');
  const dateRange = getQueryParams('startDate');
  const price = getQueryParams('price');
  const qtd = getQueryParams('qtd');

  const [sorting, setSorting] = useState<SortingState>([]);
  
  const location = useLocation()

  const startDate = dateRange ? calculateStartDate(dateRange) : null;
  
  const { data, isLoading, isError } = useQuery<sells[]>({
    queryKey: ['sells', product, totalValue, dateRange, pageNumber, price, qtd],
    queryFn: () => queryAllSells({startDate, productName: product, totalValue, n: pageNumber, price, qtd}),
  })
  const { data: products } = useQuery<products[]>({
    queryKey: ['allProducts', product],
    queryFn: () => findAllProducts({category: null, name: product, totalValue: null, price: null, qtd: null, manufacturer: null}),
  })

  const { data: paginationSells } = useQuery<sells[]>({
    queryKey: ['paginationSells', product, totalValue, dateRange, price, qtd],
    queryFn: () => findAllSells({startDate, productName: product, totalValue, price, qtd}),
  });
  
  const sells = data || [];

  const table = useReactTable({
    data: sells,
    columns: sellsCollums,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
        sorting,
      },
});
  const totalQtd = (paginationSells || []).reduce((sum, sell) => sum + sell.qtd, 0)
  const totalValueSum = (paginationSells || []).reduce((sum, sell) => sum + sell.totalValue, 0)
  // const totalValueSumProducts = (products || []).filter((p) => sells.map((s) => s.productId).includes(p.id)).reduce((sum, p) => sum + p.totalValue, 0)

  if (isLoading) return <p>Espere um minuto</p>;
  if (isError) return <NotFound />;

  return (
    <main className="w-full">
      <div className="flex flex-col gap-4  w-full items-center justify-between my-10">
        <div className='flex gap-4'>
        <SearchBar to='sells'/>
        <Select title='totalValue' page='sells'>
        <option>Valor total da compra</option>
          {(totalValuesRanges|| []).map((option) => (
                <option key={option} value={option}>
                  {'> R$ ' + option}
                </option>
          ))}
        </Select>

        <Select title="startDate" page="sells">
          <option>Dia da compra</option>
            {dateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
        </Select>

        <Select title="qtd" page="sells">
          <option>Quantidade da compra</option>
            {qtdRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
        </Select>

        <Select title="price" page="sells">
          <option>Preço</option>
            {priceRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
        </Select>

        </div>
            <div className='flex gap-4'>
            <Link to={`/sells/${pageNumber}`} className="btn btn-primary">Limpar</Link>
        <Button onClick={() => create10sells().then(() => ToastSuccess({message: 'Vendas criadas com sucesso!'}))} title="Criar 10 vendas aleatórios" />
        <PdfButton to={`/sellsPrint/${location.search}`}/>

            </div>
      </div>
      <div>
        {/* <p>Lucro das vendas: {totalValueSum - totalValueSumProducts} - {totalValueSumProducts}</p> */}
      {sells.length > 0 ?
        <TableData table={table}>
          <tr>
            <th colSpan={2}></th>
            <th className="text-center text-xl p-0 w-fit">Quantidade total: {totalQtd}</th>
            <th className="text-center text-xl p-0 w-fit">Soma das vendas: R${totalValueSum.toFixed(2)}</th>
          </tr>
        </TableData>
           : 
        <p className="m-auto flex items-center justify-center mt-32">Não há nenhum produto</p>
      }
      </div>
      <Pagination data={paginationSells || []} queryKey="sells" />
    </main>
  );
}
