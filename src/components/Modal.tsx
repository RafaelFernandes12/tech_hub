import { SubmitHandler, useForm } from "react-hook-form"
import { products } from "../models/products"
import { createProduct } from "../operations/products"
import { Toast } from "../utils/Toast"

export function Modal(){
    const { register, handleSubmit, formState: { errors }} = useForm<products>()

    const onSubmit: SubmitHandler<products> = async (data) => {
      const qtd = Number(data.qtd)
      await createProduct(data.name, data.category, data.manufacturer, qtd).then(() => {
          Toast({message: "Produto criado com sucesso!"})
      })
    }
    
    const handleCloseModal = () => {
      const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
      modal.close();
    }
    return (
        <>
        <button className="btn" onClick={()=>(document.getElementById('my_modal_1') as HTMLDialogElement).showModal()}>
            Criar produto
        </button>
            <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Criar produto</h3>
                <p className="py-4">Press ESC key or click the button below to close</p>
                <div className="modal-action w-full m-auto flex flex-col items-center justify-center">
                <form method="dialog" onSubmit={handleSubmit(onSubmit)} className="form-control flex items-center justify-center gap-4">
                    <input className="input input-bordered w-full max-w-xs" placeholder="Insira o nome" {...register("name", { required: true })} />
                    {errors.name && <span>Esse campo é obrigatório</span>}

                    <input className="input input-bordered w-full max-w-xs" placeholder="Insira o fabricante" {...register("manufacturer", { required: true })} />
                    {errors.manufacturer && <span>Esse campo é obrigatório</span>}

                    <input className="input input-bordered w-full max-w-xs" placeholder="Insira a categoria" {...register("category",  { required: true })} />
                    {errors.category && <span>Esse campo é obrigatório</span>}

                    <input type="number" className="input input-bordered w-full max-w-xs" placeholder="Insira a quantidade" {...register("qtd", { required: true })} />
                    {errors.qtd && <span>Esse campo é obrigatório</span>}

                    <div className="flex gap-4">
                        <input type="submit" className="cursor-pointer btn"/>
                        <button type="button" className="btn" onClick={handleCloseModal}>Close</button>
                    </div>
                </form>
                </div>
            </div>
        </dialog>
        </>
    )
}