import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from 'react-query'
import { useNavigate } from "react-router-dom";
import { Card } from "../componentes/Card";
import { Modal } from "../componentes/Modal";
import { useBackend } from "../hooks/useBackend";
import { BackendResponse, Pedido } from "../interfaces";
import { Button } from "../tags";

export function Home() {
    const [modalAberto, setModalAberto] = useState(false);
    const [pedidos, setPedidos] = useState<Pedido[]>([])

    const navigate = useNavigate()
    const { todosRegistros } = useBackend('pedidos')

    const { data: dadosPedidos, status: statusPedidos, refetch: refreshPedidos } = useQuery('pedidos', () => todosRegistros())

    useEffect(() => {
        statusPedidos === "success" && setPedidos(dadosPedidos!.data.results as Pedido[])
    }, [statusPedidos])

    return (
        <div className="p-5">
            <h1 className="t-1">Home</h1>

            <div className="grid grid-cols-12 gap-8 mt-12">

                {/* <div className="col-span-12 lg:col-span-4">
                    <h1 className="t-2">Pedidos em Aberto</h1>

                </div> */}

                <div className="col-span-12 lg:col-span-5">
                    <h1 className="t-2">Pedidos emitidos</h1>

                    <div className="shadow rounded-lg mt-10">

                        <table className="min-w-full divide-y divide-blue-900">

                            <thead className="bg-blue-200">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Identificador</th>

                                    <th key={'dadoExibicao.coluna + dadoExibicao.chaveApi'} scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">
                                        N° Itens
                                    </th>

                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-blue-900">
                                {
                                    dadosPedidos?.data.results.map((pedido: Pedido) => (
                                        <motion.tr key={pedido.uuid} className="bg-blue-200 text-blue-900 font-medium cursor-pointer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
                                            onClick={() => {
                                                navigate('visualizar-pedido/' + pedido.uuid)
                                            }}
                                        >
                                            <td className="coluna-grid"><span className="p-1 rounded-lg bg-green-200 font-bold text-green-900">Aberto</span></td>
                                            <td className="coluna-grid truncate"><span className="w-12 trucante">{pedido.uuid}</span></td>
                                            <td className="coluna-grid text-right">pedido.n_itens</td>
                                        </motion.tr>
                                    ))
                                }
                            </tbody>

                        </table>

                    </div>

                </div>

                {/* <div className="col-span-12 lg:col-span-4">
                    <h1 className="t-2">Pedidos a serem emitidos</h1>

                    <div className="grid grid-cols-3 w-full h-72 bg-blue-100 rounded-lg mt-4 px-4 py-2">
                        <div className="font-bold text-blue-900">ID</div>
                        <div className="font-bold text-blue-900">Loja</div>
                        <div className="font-bold text-blue-900">Quantidade Itens</div>
                    </div>

                </div> */}

            </div>
        </div>
    )
}
