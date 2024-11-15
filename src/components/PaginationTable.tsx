interface paginationTableProps {
    previousPage: () => void
    disabledPreviousPage: boolean
    where: number
    pageCount: number
    nextPage: () => void
    disabledNextPage: boolean
}

export function PaginationTable(props: paginationTableProps){
    return (
        <div className="join flex items-center justify-center m-6">
                <button className="join-item btn" onClick={props.previousPage} disabled={props.disabledPreviousPage}>
                    «
                </button>
                <button className="join-item btn">
                    Página {props.where} de {props.pageCount}
                </button>
                <button className="join-item btn" onClick={props.nextPage} disabled={props.disabledNextPage}>
                    »
                </button>
            </div>
    )
}