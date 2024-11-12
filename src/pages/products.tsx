import { useMutation, useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { Pagination } from '../components/Pagination'
import { SearchBar } from '../components/SearchBar'
import { Select } from '../components/Select'
import { products } from '../models/products'
import { create10Products, findAllCategories, findAllManufactures, findAllProducts, queryAllProducts } from '../operations/products'
import { capitalizeFirstLetter } from '../utils/capitalizeWord'
import { getPageParam, getQueryParams } from '../utils/getParams'
import { NotFound } from './notFound'

const categoryTitle = 'category'
const manufacturerTitle = 'manufacturer'

export default function Products() {
  
    const product = getQueryParams('product')
    const category = getQueryParams('category')
    const manufacturer = getQueryParams('manufacturer') 
    const { n } = getPageParam()    
    
    const pageNumber = n ? parseInt(n) : 1

    const { data, isLoading, isError } = useQuery<products[]>({
      queryKey: ["products", product, category, manufacturer, pageNumber],
      queryFn: () => queryAllProducts(product, category, manufacturer, pageNumber)
    })

    const products = data ? data : []

    const mutation = useMutation ({
      mutationFn: () => create10Products()
    })

    if(isLoading) return <p>Espere um minuto</p>
    if(isError) return <NotFound />
    if(mutation.isPending) return <p>Adicionando produtos</p>

    return (
      <main className='w-full'>
        <div className='flex gap-4 w-full items-center justify-between my-10'>
          <SearchBar />
          <Select apiCall={findAllCategories} title={category ? category : categoryTitle} apiName={categoryTitle}/>
          <Select apiCall={findAllManufactures} title={manufacturer ? manufacturer : manufacturerTitle} apiName={manufacturerTitle}/>
          <Link to={`/products/${pageNumber}`} className='btn btn-primary'>Limpar</Link >
          <Button onClick={() => mutation.mutate()} title='Criar 10 produtos aleatórios'/>
          <Modal />
        </div>
        <div className='grid grid-cols-4 gap-4'>
          {products.map((p) => {
            return (
              <div key={p.id} className="card card-body flex flex-col p-2">
                <span className="card-title">Nome: {p.name}</span>
                <span>Fabricante: {capitalizeFirstLetter(p.manufacturer)}</span>
                <span>Categoria: {capitalizeFirstLetter(p.category)}</span>
                <span>Quantidade: {p.qtd}</span>
                <span>Preço: {p.price}</span>
              </div>
            )
          })}
        </div>
        <Pagination
          queryKey="products"
          queryOptions={[product, category, manufacturer]}
          queryFn={(product, category, manufacturer) => findAllProducts(product, category, manufacturer)}
        />

    </main>
    )
  }

