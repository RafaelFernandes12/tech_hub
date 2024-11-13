import axios from "../lib/axios";

export async function queryAllProducts(name: string | null, category: string | null, manufacturer: string | null, n: number){
    const res = await axios.get(`/products/page/${n}`, {
        params: {
            name,
            category,
            manufacturer
        }
    })
    const data = await res.data
    return data
}
export async function findAllProducts(name: string | null, category: string | null, manufacturer: string | null){
    return (await axios.get(`/products`, {
        params: {
            name,
            category,
            manufacturer
        }
    })).data
}
export async function findOneProduct(id: number){
    return (await axios.get(`/products/${id}`)).data
}

export async function findAllCategories(){
    return (await axios.get("/products/categories")).data
}

export async function findAllManufactures(){
    return (await axios.get("/products/manufacturers")).data
}

export async function createProduct(name: string, category: string, manufacturer: string, qtd: number){
    return (await axios.post("/products", {name, category, manufacturer, qtd})).data
}
export async function create10Products(){
    return (await axios.post("/create10Products")).data
}