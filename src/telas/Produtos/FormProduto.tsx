import { BotoesForm } from "../../componentes/BotoesForm";

export function FormProduto() {
    return (
        <div>

            <h1 className="t-1 mb-8">Produto</h1>

            <BotoesForm />

            <div className="inputs">

                <div className="col-span-12 md:col-span-5 lg:col-span-4">
                    <label>Nome</label>
                    <input type="text" />
                </div>

                <div className="col-span-12 md:col-span-4 lg:col-span-2">
                    <label>Preço</label>
                    <input type="text" className="text-right" />
                </div>

                <div className="col-span-12 md:col-span-3 lg:col-span-1">
                    <label>Unidade Pri.</label>
                    <input type="text" />
                </div>

                <div className="col-span-12 md:col-span-4 lg:col-span-1">
                    <label>Quantidade</label>
                    <input type="text" className="text-right" />
                </div>

                <div className="col-span-12 md:col-span-3 lg:col-span-1">
                    <label>Unidade Item</label>
                    <input type="text" />
                </div>

                <div className="col-span-12 md:col-span-4 lg:col-span-1">
                    <label>Quantidade</label>
                    <input type="text" className="text-right" />
                </div>

            </div>

        </div>
    )
}
