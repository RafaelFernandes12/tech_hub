import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { products } from "../models/products";
import { sells } from "../models/sells";
import { findOneProduct } from "../operations/products";
import { getFullDate } from "./getFullDate";

export const productCollums: ColumnDef<(products)>[] = [
    {
        accessorKey: 'name',
        header: 'Nome',
        enableSorting: true,
        cell: (props: any) => <p>{props.getValue()}</p>    
    },
    {
        accessorKey: 'category',
        header: 'Categoria',
        enableSorting: true,
        cell: (props: any) => <p>{props.getValue()}</p>    
    },
    {
        accessorKey: 'manufacturer',
        header: 'Fabricante',
        enableSorting: true,
        cell: (props: any) => <p>{props.getValue()}</p>    
    },
    {
        accessorKey: 'qtd',
        header: () => <p className="text-center">Quantidade</p>,
        enableSorting: true,
        sortingFn: 'basic',

        cell: (props: any) => <p className="text-center">{props.getValue()}</p>    
    }
]
    export const sellsCollums: ColumnDef<(sells)>[] = [
    {
        accessorKey: 'date',
        header: () => <p className="text-center">Data</p>,
        enableSorting: true,
        cell: (props: any) => <p className="text-center">{getFullDate(props.getValue())}</p>    
    },
    {
        accessorKey: 'price',
        header: () => <p className="text-center">Preço</p>,
        enableSorting: true,
        cell: (props: any) => <p className="text-center">R${props.getValue()}</p>    
    },
    {
        accessorKey: 'qtd',
        header: () => <p className="text-center">Quantidade</p>,
        enableSorting: true,
        sortingFn: 'basic',
        cell: (props: any) => <p className="text-center">{props.getValue()}</p>    
    },
    {
        accessorKey: 'totalValue',
        header: () => <p className="text-center">Valor total</p>,
        enableSorting: true,
        sortingFn: 'basic',
        cell: (props: any) => <p className="text-center">R${props.getValue()}</p>    
    },
    {
        accessorKey: 'productId',
        header: 'Produto',
        enableSorting: true,
        sortingFn: 'basic',
        cell: (props: any) => {

            const { data: product } = useQuery<products>({
                queryKey: [`/products/${props.getValue()}`,],
                queryFn: () => findOneProduct(props.getValue()),
            });
            return <p>{product ? product.name : ''}</p>
        }
    },
]