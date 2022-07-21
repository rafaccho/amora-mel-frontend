import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Base } from "../../interfaces";

function ViewDado(props: { titulo: string, info: string }) {
    return (
        <div className="flex flex-col mb-4">
            <b>{props.titulo}</b>
            <div className="w-100 p-1 bg-gray-800 rounded-lg mb-1" />
            <span>{props.info}</span>
        </div>
    )
}

export function Card(props: {
    state: { modalAberto: any, setModalAberto: any },
    dados?: any,
    extratores: any[],
    defaults?: {},
    botao: {titulo: string, url: string, callbacks: {mobile: () => void, padrao: () => void}},
}) {
    const navigate = useNavigate()
    
    const fecharModal = () => props.state.setModalAberto(false)
    const abrirModal = () => props.state.setModalAberto(true)

    const dadosViews = props.extratores.map((extrator: Function, index: number) => {
            const { titulo, info, } = extrator(props.dados)
            return <ViewDado key={`${titulo}-${index}`} titulo={titulo} info={info} />
        })

    return (
        <motion.div id="card-index" className="bg-gray-300 w-full md:w-64 h-80 overflow-y-auto rounded-lg pb-3">

            <div id="card-cabecalho" className="flex justify-between font-medium p-2 bg-gray-50 rounded-t-lg pr-4">
                <span className="text-green-500">Ativo</span> <span title="a98a87">68a5r4</span>
            </div>

            <div id="card-conteudo" className="w-full rounded-b-lg">
                <div className="flex flex-col flex-wrap p-5">{dadosViews}</div>

                <div className="self-center flex justify-center">
                    {/* <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }} onClick={() => navigate(props.botao.url)} className="btn-l mb-5">{props.botao.titulo}</motion.button> */}
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }} onClick={() => props.botao.callbacks.padrao()} className="btn-l mb-5">{props.botao.titulo}</motion.button>
                </div>
            </div>
        </motion.div>
    )
}