import { useQuery } from '@tanstack/react-query';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { TableData } from '../components/TableData';
import { sells } from '../models/sells';
import { findAllSells } from '../operations/sells';
import { calculateStartDate } from '../utils/calculateStartDate';
import { sellsCollums } from '../utils/collums';
import { getQueryParams } from '../utils/getParams';

export default function SellsPrint() {
  const product = getQueryParams('product');
  const totalQuery = getQueryParams('totalValue');
  const dateRange = getQueryParams('startDate');
  const price = getQueryParams('price');
  const qtd = getQueryParams('qtd');
  const totalValue = totalQuery
  const startDate = dateRange ? calculateStartDate(dateRange) : null;

  const { data } = useQuery<sells[]>({
    queryKey: ['sells'],
    queryFn: () => findAllSells({startDate, productName: product, totalValue, price, qtd}),
  });
  
  const sells = data || [];

  const table = useReactTable({
    data: sells,
    columns: sellsCollums,
    getCoreRowModel: getCoreRowModel(),
});
const contentRef = useRef<HTMLTableElement>(null);
    const reactToPrintFn = useReactToPrint({
        contentRef,
    })
    const totalQtd = useMemo(() => sells.reduce((sum, sell) => sum + sell.qtd, 0), [sells]);
  const totalValueSum = useMemo(() => sells.reduce((sum, sell) => sum + sell.totalValue, 0), [sells]);
  return (
    <main className="w-full">
    <button onClick={() => reactToPrintFn()} className="btn btn-primary float-end absolute">Imprimir PDF</button>
    <div ref={contentRef}>
        <h1 className="text-2xl font-bold m-5 text-center">TechHub</h1>
        <TableData table={table}>
        <tr>
            <th colSpan={2}></th>
            <th className="text-center text-xl">Quantidade total: {totalQtd}</th>
            <th className="text-center text-xl">Soma das vendas: R${totalValueSum.toFixed(2)}</th>
          </tr>
        </TableData>
    </div>
    </main>
  );
}
