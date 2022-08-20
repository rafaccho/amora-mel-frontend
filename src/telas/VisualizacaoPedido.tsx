import { useNavigate, useParams } from "react-router-dom"
import { useBackend } from "../hooks/useBackend"
import { useQuery } from 'react-query'
import { Modal } from "../componentes/Modal";
import { useState } from "react";
import { Pedido } from "../interfaces";
import { motion } from "framer-motion";
import { Button } from "../tags";

export function VisualizacaoPedido() {
    const [modalAberto, setModalAberto] = useState(false)
    const navigate = useNavigate()

    const { uuid } = useParams()
    const { todosRegistros } = useBackend('pedidos')
    const { data: dadosPedido, status: statusPedido, refetch: refreshPedido, isRefetching: refreshingPedido } = useQuery('pedidos', () => todosRegistros())

    const abrirFecharModal = () => setModalAberto(!modalAberto)

    return (
        <div className="p-5">
            <h1 className="t-1">Pedido {uuid?.split('-')[0]}</h1>

            <div className="grid grid-cols-12 gap-8 mt-12 px-5">

                <div className="col-span-12">

                    <div className="w-full flex justify-between">
                        <h1 className="t-2">Itens</h1>

                        <div className="flex gap-5">
                            <Button titulo="Finalizar Pedido" className="botao-azul-1" />
                            <Button titulo="Cancelar Pedido" className="botao-azul-1" />
                        </div>

                    </div>

                    <div className="flex w-full gap-5">

                        <div id="produtos" className="shadow rounded-lg mt-10">
                            <table className="min-w-full divide-y divide-blue-900">

                                <thead className="bg-blue-200">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Comprado</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Produto</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs text-blue-900 font-extrabold uppercase tracking-wider whitespace-nowrap">Quantidade</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-blue-900">
                                    {
                                        dadosPedido?.data.results.map((pedido: Pedido) => (
                                            <motion.tr key={pedido.uuid} className="bg-blue-200 text-blue-900 font-medium cursor-pointer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={abrirFecharModal}>
                                                <td className="coluna-grid"><span className="p-1 rounded-lg bg-green-200 font-bold text-green-900">Sim</span></td>
                                                <td className="coluna-grid text-right">{pedido.produto}</td>
                                                <td className="coluna-grid truncate"><span className="w-12 trucante">{pedido.quantidade}</span></td>
                                            </motion.tr>
                                        ))
                                    }
                                    {
                                        dadosPedido?.data.results.map((pedido: Pedido) => (
                                            <motion.tr key={pedido.uuid} className="bg-blue-200 text-blue-900 font-medium cursor-pointer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={abrirFecharModal}>
                                                <td className="coluna-grid"><span className="p-1 rounded-lg bg-rose-200 font-bold text-rose-900">Não</span></td>
                                                <td className="coluna-grid text-right">{pedido.produto}</td>
                                                <td className="coluna-grid truncate"><span className="w-12 trucante">{pedido.quantidade}</span></td>
                                            </motion.tr>
                                        ))
                                    }
                                </tbody>

                            </table>
                        </div>

                    </div>


                </div>

            </div>

            <div id="modal" className="flex flex-col items-center justify-center">
                {modalAberto && <Modal fecharModal={abrirFecharModal} text="aa" />}
            </div>
        </div>
    )
}