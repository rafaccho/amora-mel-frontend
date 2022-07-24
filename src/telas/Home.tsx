import { useEffect, useState } from "react";
import { useQuery } from 'react-query'
import { Card } from "../componentes/Card";
import { Filtros } from "../componentes/Filtros";
import { Modal } from "../componentes/Modal";
import { useBackend } from "../hooks/useBackend";
import { BackendResponse } from "../interfaces";
import { Pedido } from "../interfaces";

export function Home() {
    const [modalAberto, setModalAberto] = useState(false);
    const [endpoint2, setEndpoint2] = useState(undefined)
    const [pedidos, setPedidos] = useState([])

    const { todosRegistros } = useBackend('pedidos')

    const { data, isLoading, status, refetch } = useQuery('pedidos', () => todosRegistros(endpoint2))

    const fecharModal = () => setModalAberto(false) // const abrirModal = () => setModalAberto(true)

    /* useEffect(() => {
        if (data) {
            let newData = data as BackendResponse
            setPedidos(newData.results)
        }
    }, [data]) */

    return (
        <div className="w-full h-screen">

            <h1 className="t-1">Home</h1>

            {/*
                isLoading
                    ? <h1>Loading</h1>
                    : (
                        <div id="conteudo-home" className="p-3">

                            <Filtros />

                            <br />
                            <br />

                            <div id="cards" className="flex flex-wrap justify-center gap-5 pt-8">
                                {
                                    pedidos.map((pedido: Pedido, index: number) =>
                                        <Card
                                            key={pedido.uuid}
                                            state={{ modalAberto, setModalAberto }}
                                            //pedido={pedido}
                                        />
                                    )
                                }
                            </div>

                            {modalAberto && <Modal handleClose={fecharModal} text={"asd"} type={"dropIn"} />}

                        </div>
                    )
                            */}
        </div>
    )
}
