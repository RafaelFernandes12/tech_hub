import axios from "../lib/axios";

type queryAllSells = {
    startDate: Date | null
    productName: string | null
    totalValue: string | null
    qtd: string | null
    price: string | null
    n: number
}
type findAllSells = Omit<queryAllSells, 'n'>;

export async function queryAllSells({n, price, productName, qtd, startDate, totalValue} : queryAllSells){
    const res = await axios.get(`/sells/page/${n}`, {
        params: {
            startDate,
            productName,
            totalValue,
            price,
            qtd
        }
    })
    const data = await res.data
    return data
}

export async function findAllSells({price, productName, qtd, startDate, totalValue} : findAllSells){
    return (await axios.get(`/findAllSells`, {
        params: {
            startDate,
            productName,
            totalValue,
            qtd,
            price
        }
    })).data
}

export async function create10sells(){
    return (await axios.post("/sell10Products")).data
}