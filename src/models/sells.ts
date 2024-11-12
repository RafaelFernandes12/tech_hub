import { products } from "./products";

export interface sellsProps {
    id: number
    date: string;
    qtd: number;
    profit: number
    totalValue: number;
    product: products;
}