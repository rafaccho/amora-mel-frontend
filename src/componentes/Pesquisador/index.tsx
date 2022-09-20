import { Fragment, useRef } from 'react'
import { useQuery } from 'react-query'
import { IoIosCloseCircle } from "react-icons/io"

import { useBackend } from '../../hooks/useBackend'
import { Endpoint } from '../../tipos'

interface Props {
    state: {
        uuid: any
        setUuid: any

        filtro: any
        setFiltro: any
    }
    titulo: string
    endpoint: Endpoint
    exibidor: (i: any) => string
}

export function Pesquisador(props: Props) {
    const { uuid, setUuid } = props.state
    const { filtro, setFiltro } = props.state

    const listaRegistros = useRef<HTMLDivElement>(null)
    const txtValor = useRef<HTMLInputElement>(null)

    const { todosRegistros } = useBackend(props.endpoint)
    const { data, refetch } = useQuery([`${props.endpoint}_search`], () => todosRegistros(undefined, `search=${txtValor.current?.value}`))

    function abrirFecharModal() {
        listaRegistros.current?.classList.contains("hidden")
            ? listaRegistros.current?.classList.remove("hidden")
            : listaRegistros.current?.classList.add("hidden")
    }

    function limparEstados() {
        setUuid('')
        setFiltro('')
    }

    return (
        <Fragment>
            <input
                ref={txtValor}
                value={filtro}
                onChange={evento => {
                    if (uuid) {
                        limparEstados()
                        if(txtValor.current) txtValor.current.value = ""
                        refetch()
                        return 
                    }
                    setFiltro(evento.target.value)
                    refetch()
                }}
                onClick={() => {
                    abrirFecharModal()
                    // limparEstados()
                }}
            />

            <div ref={listaRegistros} className='w-80 h-96 bg-blue-100 z-50 absolute p-3 hidden'>
                <div className="w-full flex justify-between">
                    <h1 className="mb-4 font-bold text-lg">{props.titulo}</h1>
                    <div className="flex justify-end items-start">
                    <span className='flex justify-end items-start cursor-pointer' onClick={() => {
                        abrirFecharModal()
                        !uuid && setFiltro('')
                    }}><IoIosCloseCircle size={24} /></span>
                    </div>
                </div>

                <div id="container-itens" className='bg-blue-200 w-full h-80 flex flex-col gap-2 rounded p-3 overflow-auto'>
                    {
                        data && data.data.results.map((item: any) => (
                            <div key={item.uuid} id={`item-${item.uuid}`} className='bg-blue-100 w-full rounded-lg font-semibold text-center p-2 cursor-pointer'
                                onClick={() => {
                                    setUuid(item.uuid)
                                    setFiltro(props.exibidor(item))
                                    abrirFecharModal()
                                }}
                            >
                                {props.exibidor(item)}
                            </div>
                        ))
                    }
                </div>

            </div>
        </Fragment>
    )
}