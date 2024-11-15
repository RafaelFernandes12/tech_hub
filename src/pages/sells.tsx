import { useQuery } from '@tanstack/react-query';
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { Pagination } from '../components/Pagination';
import { PdfButton } from '../components/PdfButton';
import { Select } from '../components/Select';
import { TableData } from '../components/TableData';
import { products } from '../models/products';
import { sells } from '../models/sells';
import { queryAllProducts } from '../operations/products';
import { create10sells, findAllSells, queryAllSells } from '../operations/sells';
import { calculateStartDate } from '../utils/calculateStartDate';
import { capitalizeFirstLetter } from '../utils/capitalizeWord';
import { sellsCollums } from '../utils/collums';
import { getPageParam, getQueryParams } from '../utils/getParams';
import { NotFound } from './notFound';

const totalValuesRanges = [500, 1000, 2000, 5000, 100000]
const priceRanges = [1, 5, 10, 20, 50, 100]
const qtdRanges = [1, 2, 5, 7, 10]
const dateRanges = [
  { label: 'Last Week', value: 'lastWeek' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'Last 3 Months', value: 'lastThreeMonths' },
  { label: 'Last Year', value: 'lastYear' },
];

export default function Sells() {
  const pageNumber = getPageParam()
  const productName = getQueryParams('productName');
  const totalQuery = getQueryParams('totalValue');
  const dateRange = getQueryParams('startDate');
  const price = getQueryParams('price');
  const qtd = getQueryParams('qtd');
  const [sorting, setSorting] = useState<SortingState>([]);
  const location = useLocation()
  const totalValue = totalQuery ? parseInt(totalQuery) : null
  const startDate = dateRange ? calculateStartDate(dateRange) : null;

  const { data, isLoading, isError } = useQuery<sells[]>({
    queryKey: ['sells', productName, totalValue, dateRange, pageNumber, price, qtd],
    queryFn: () => queryAllSells({startDate, productName, totalValue, n: pageNumber, price: Number(price), qtd: Number(qtd)}),
  })
  const { data: products } = useQuery<products[]>({
    queryKey: ['/queryAllProducts', pageNumber],
    queryFn: () => queryAllProducts(null, null, null, pageNumber),
  });

  const productsTitles = products ? products.map(p => p.name) : []

  const { data: paginationSells } = useQuery<sells[]>({
    queryKey: ['sells'],
    queryFn: () => findAllSells({startDate, productName, totalValue, price: Number(price), qtd: Number(qtd)}),
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

  if (isLoading) return <p>Espere um minuto</p>;
  if (isError) return <NotFound />;

  return (
    <main className="w-full">
      <div className="flex gap-4 w-full items-center justify-between my-10">
        <Select title='productName' page='sells'>
          <option>Nome do produto</option>
          {(productsTitles || []).map((option) => (
                <option key={option} value={option}>
                  {capitalizeFirstLetter(option)}
                </option>
              ))}
        </Select>
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
        <Link to={`/sells/${pageNumber}`} className="btn btn-primary">Limpar</Link>
        <Button onClick={() => create10sells()} title="Criar 10 vendas aleatórios" />
        <PdfButton to={`/sellsPrint/${location.search}`}/>
      </div>
      <div>
      {sells.length > 0 ?
        <TableData table={table}/> : 
        <p className="m-auto flex items-center justify-center mt-32">Não há nenhum produto</p>
      }
      </div>
      <Pagination data={paginationSells || []} queryKey="sells" />
    </main>
  );
}
