import { useEffect, useRef, useState } from "react";
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { toast } from "react-toastify";

import { CardAreaEntrega } from "../../componentes/CardAreaEntrega";
import { Filtros } from "../../componentes/Filtros";
import { DEFAULT_TOAST_CONFIG } from "../../constantes";

import { useBackend } from "../../hooks/useBackend";

import { AreaEntrega, Fornecedor, Produto, ViacepResponse } from "../../interfaces";
import { Button } from "../../tags";


export function PainelProduto() {
    const [codigo, setCodigo] = useState('')
    const [uuid, setUuid] = useState('')
    const [nome, setNome] = useState('')

    const [quantidade1, setQuantidade1] = useState('')
    const [unidade1, setUnidade1] = useState('')
    const [quantidade2, setQuantidade2] = useState('')
    const [unidade2, setUnidade2] = useState('')

    const [preco, setPreco] = useState('')

    const [areasEntrega, setAreasEntrega] = useState<Produto[]>([])
    // const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])

    const inputs = useRef<HTMLDivElement>(null)

    const { criarRegistro, editarRegistro, todosRegistros } = useBackend('produtos')

    const dados = {
    }

    const queryClient = useQueryClient()

    const mutation = useMutation(() => uuid ? editarRegistro(uuid, dados) : criarRegistro(dados), {
        onSuccess: () => {
            toast.success('Registro salvo com sucesso!', DEFAULT_TOAST_CONFIG)
            queryClient.invalidateQueries(['produtos'])
            limparCampos()
        },
        onError: (err) => {
            toast.error('Ocorreu um erro!', DEFAULT_TOAST_CONFIG)
        },
    })

    const { data, isLoading, status, refetch } = useQuery('produtos', () => todosRegistros())

    function validarCampos(): boolean {
        const fork = inputs.current!.querySelectorAll('input')
        const valido = Array.from(fork).every(input => input.checkValidity())

        return valido
    }

    function limparCampos(): void {
        setCodigo('')
        setUuid('')
        setNome('')
    }

    useEffect(() => {
        if (isLoading) return
        if (status === 'success') setAreasEntrega(data.results as Produto[])
        else toast.error("Ocorreu um erro ao carregar as áreas de entrega", DEFAULT_TOAST_CONFIG)
    }, [isLoading, data])

    return (
        <div className="w-full max-w-full">
            <h1 className="t-1 mb-2">Produtos</h1>

            <div className="grid grid-cols-12 mt-12 lg:gap-12">

                <div id="registros" className="col-span-12 lg:col-span-9">
                    <Filtros refetch={refetch} />

                    <div id="cards" className="grid grid-cols-12 gap-5 mt-12">
                        {
                            areasEntrega.map((produto: Produto) => (
                                <div className="col-span-12 md:col-span-6 lg:col-span-4">
                                    <CardAreaEntrega
                                        key={produto.uuid}
                                        titulo={produto.nome}
                                        dados={{
                                            "Código": produto.codigo ? produto.codigo : produto.uuid,
                                            "Nome": produto.nome,
                                            "Preço": produto.preco,
                                            "Quantidade": produto.quantidade,
                                            "Unidade": produto.unidade,
                                            // "Unidade2": produto.,
                                        }}
                                        onEditar={() => {
                                            setCodigo(produto.codigo)
                                            setUuid(produto.uuid)

                                            /* setPreco(produto.preco)

                                            setQuantidade1(produto.quantidade)
                                            setQuantidade2(produto.quantidade) */

                                            setUnidade1(produto.unidade)
                                            setUnidade2(produto.unidade)
                                        }}
                                    />
                                </div>
                            ))
                        }

                    </div>
                </div>

                <div ref={inputs} id="formulario" className="hidden lg:block col-span-3">
                    <div className="inputs">

                        <div className="col-span-12">
                            <h1 className="t-3 mb-5">Informações Principais</h1>
                        </div>

                        <div className="col-span-12">
                            <label>Identificador </label>
                            <input type="text" value={uuid} readOnly disabled />
                        </div>

                        <div className="col-span-12">
                            <label>Código</label>
                            <input type="text" value={codigo} onChange={e => setCodigo(e.target.value)} />
                        </div>

                        <div className="col-span-12">
                            <label>Preço</label>
                            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
                        </div>


                        <div className="col-span-12">
                            <label>Quantidade 1</label>
                            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
                        </div>

                        <div className="col-span-12">
                            <label>Unidade 1</label>
                            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
                        </div>

                        <div className="col-span-12">
                            <label>Quantidade 2</label>
                            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
                        </div>

                        <div className="col-span-12">
                            <label>Unidade 2</label>
                            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
                        </div>


                        <div className="col-span-12">
                            <Button title={uuid ? 'Salvar' : 'Cadastrar'}
                                className="btn-l flex justify-center pt-3 w-full font-bold"
                                // onClick={() => validarCampos() }
                                onClick={() => !validarCampos() ? toast.error("Preencha todos os campos", DEFAULT_TOAST_CONFIG) : mutation.mutate()}
                            />
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}