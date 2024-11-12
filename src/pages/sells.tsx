import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { sellsProps } from '../models/sells'
import { create10sells, queryAllSells } from '../operations/sells'
import { getFullDate } from '../utils/getFullDate'
import { NotFound } from './notFound'

const categoryTitle = 'category'
const manufacturerTitle = 'manufacturer'


export default function Sells(){
    const [searchParams, _] = useSearchParams();
    const { n } = useParams<{ n: string }>()
    const product = searchParams.get('product')    || ''
    const category = searchParams.get('category') || ''
    const manufacturer = searchParams.get('manufacturer') || ''
    
    const pageNumber = n ? parseInt(n) : 1

    const { data, isLoading, isError } = useQuery<sellsProps[]>({
      queryKey: ["sells", pageNumber],
      queryFn: () => queryAllSells(null, null, null, pageNumber)
    })
    const sells = data ? data : []
    const mutation = useMutation ({
      mutationFn: () => create10sells()
    })

    if(isLoading) return <p>Espere um minuto</p>
    if(isError) return <NotFound />
    if(mutation.isPending) return <p>Adicionando produtos</p>

    return (
      <main className='w-full'>
        <div className='flex gap-4 w-full items-center justify-between my-10'>
           {/* <Select apiCall={findAllCategories} title={category ? category : categoryTitle} apiName={categoryTitle}/> */}
           {/* <Select apiCall={findAllManufactures} title={manufacturer ? manufacturer : manufacturerTitle} apiName={manufacturerTitle}/> */}
          <Link to={`/sells/${pageNumber}`} className='btn btn-primary'>Limpar</Link >
          <Button onClick={() => mutation.mutate()} title='Criar 10 vendas aleatórios'/>
          <Modal />
        </div>
        <div className='grid grid-cols-4 gap-4'>
          {sells.map((s) => {
            return (
              <div key={s.id} className="card card-body flex flex-col p-2">
                <span className="card-title">Data: {getFullDate(s.date)}</span>
                {/* <span>Produto: {s.product.name ? s.}</span> */}
                <span>Lucro: {s.profit * 100}%</span>
                <span>Valor total da compra: {s.totalValue}</span>
                <span>Quantidade: {s.qtd}</span>
              </div>
            )
          })}
        </div>
        {/* <Pagination /> */}
    </main>
    )

}