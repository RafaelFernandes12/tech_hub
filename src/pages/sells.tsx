import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Pagination } from '../components/Pagination';
import { Select } from '../components/Select';
import { products } from '../models/products';
import { sellsProps } from '../models/sells';
import { queryAllProducts } from '../operations/products';
import { create10sells, findAllSells, queryAllSells } from '../operations/sells';
import { calculateStartDate } from '../utils/calculateStartDate';
import { capitalizeFirstLetter } from '../utils/capitalizeWord';
import { getFullDate } from '../utils/getFullDate';
import { getPageParam, getQueryParams } from '../utils/getParams';
import { NotFound } from './notFound';

const pricesRange = [500, 1000, 2000, 5000, 100000]
const dateRanges = [
  { label: 'Last Week', value: 'lastWeek' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'Last 3 Months', value: 'lastThreeMonths' },
  { label: 'Last Year', value: 'lastYear' },
];

export default function Sells() {
  const { n } = getPageParam()
  const productName = getQueryParams('productName');
  const totalQuery = getQueryParams('totalValue');
  const dateRange = getQueryParams('startDate');
  
  const totalValue = totalQuery ? parseInt(totalQuery) : null
  const startDate = dateRange ? calculateStartDate(dateRange) : null;
  console.log(startDate)
  const pageNumber = n ? parseInt(n) : 1;
  const { data, isLoading, isError } = useQuery<sellsProps[]>({
    queryKey: ['sells', productName, totalValue, dateRange, pageNumber],
    queryFn: () => queryAllSells(startDate, productName, totalValue, pageNumber),
  })

  const { data: productsUndefined } = useQuery<products[]>({
    queryKey: ['/queryAllProducts', pageNumber],
    queryFn: () => queryAllProducts(null, null, null, pageNumber),
  });

  const { data: paginationSells } = useQuery<sellsProps[]>({
    queryKey: ['sells'],
    queryFn: () => findAllSells(null, null, null),
  });
  
  const products = productsUndefined ? productsUndefined : []
  const productsTitles = productsUndefined ? productsUndefined.map(p => p.name) : []
  const productsIds = products.map((p) => p.id)


  const sells = data || [];
  const mutation = useMutation({
    mutationFn: () => create10sells(),
  });

  if (isLoading) return <p>Espere um minuto</p>;
  if (isError) return <NotFound />;
  if (mutation.isPending) return <p>Adicionando produtos</p>;

  return (
    <main className="w-full">
      <div className="flex gap-4 w-full items-center justify-between my-10">
        <Select title='productName' page='sells'>
          {(productsTitles || []).map((option) => (
                <option key={option} value={option}>
                  {capitalizeFirstLetter(option)}
                </option>
              ))}
          </Select>
        <Select title='totalValue' page='sells'>
          {(pricesRange || []).map((option) => (
                <option key={option} value={option}>
                  {'> R$ ' + option}
                </option>
          ))}
          </Select>
          <Select title="startDate" page="sells">
            {dateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </Select>
        <Link to={`/sells/${pageNumber}`} className="btn btn-primary">Limpar</Link>
        <Button onClick={() => mutation.mutate()} title="Criar 10 vendas aleatórios" />
        <Modal />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {sells.map((s) => {

          function getProductPrice(){
            if(productsIds.includes(s.productId)) return products.find(p => p.id == s.productId)?.price
            return ''
          }
          return (
            <div key={s.id} className="card card-body flex flex-col p-2">
              <span className="card-title">Data: {getFullDate(s.date)}</span>
              <span>Preço do produto: {getProductPrice()}R$</span>
              <span>Lucro: {s.profit * 100}%</span>
              <span>Quantidade vendida: {s.qtd}</span>
              <span>Valor total da compra: {s.totalValue}</span>
            </div>
          );
        })}
      </div>
      <Pagination data={paginationSells || []} queryKey="sells" />
    </main>
  );
}
