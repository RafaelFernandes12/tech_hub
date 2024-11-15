export function Button({onClick, title} : {onClick: () => void, title: string}){
    return <button className="btn btn-primary" onClick={onClick}>{title}</button>
}