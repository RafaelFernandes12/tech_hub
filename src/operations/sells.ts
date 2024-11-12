import axios from "../lib/axios";

export async function queryAllSells(startDate: Date | null, productId: number | null, totalValue: number | null, n: number){
    const res = await axios.get(`/sells/page/${n}`, {
        params: {
            startDate,
            productId,
            totalValue
        }
    })
    const data = await res.data
    return data
}

export async function createProduct(date: Date, productId: number, profit: number, qtd: number){
    return (await axios.post("/sells", {date, productId, profit, qtd})).data
}
export async function create10sells(){
    return (await axios.post("/sell10Products")).data
}