export function Header(){
    return (
        <header className="p-4 bg-black w-full">
            <ul className="flex gap-4 items-center justify-center">
                <li><a className="link link-hover" href="/products/1">Produtos</a></li>
                <li><a className="link link-hover" href="/sells/1">Vendas</a></li>
            </ul>
        </header>
    )
}