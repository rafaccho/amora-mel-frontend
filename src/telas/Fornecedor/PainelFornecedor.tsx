import { useEffect, useRef, useState } from "react";
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { toast } from "react-toastify";

import { CardRegistros } from "../../componentes/CardAreaEntrega";
import { Filtros } from "../../componentes/Filtros";
import { Loading } from "../../componentes/Loading";
import { DEFAULT_TOAST_CONFIG } from "../../constantes";

import { useBackend } from "../../hooks/useBackend";

import { AreaEntrega, Fornecedor, Produto, ViacepResponse } from "../../interfaces";
import { Button } from "../../tags";


export function PainelFornecedor() {
    const [codigo, setCodigo] = useState('')
    const [uuid, setUuid] = useState('')
    const [nome, setNome] = useState('')
    const [quantidade1, setQuantidade1] = useState<string | number>('')
    const [unidade1, setUnidade1] = useState('')
    const [quantidade2, setQuantidade2] = useState<string | number>('')
    const [unidade2, setUnidade2] = useState('')
    const [preco, setPreco] = useState('')
    const [produtos, setProdutos] = useState<Produto[]>([])

    const inputs = useRef<HTMLDivElement>(null)

    const dados = {
    }

    const { criarRegistro, editarRegistro, todosRegistros, deletarRegistro } = useBackend('produtos')
    const queryClient = useQueryClient()
    const criarEditar = useMutation(() => uuid ? editarRegistro(uuid, dados) : criarRegistro(dados), {
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
        const inputsForm = inputs.current!.querySelectorAll('input')
        const valido = Array.from(inputsForm).every(input => input.checkValidity())

        return valido
    }

    function limparCampos(): void {
        setCodigo('')
        setUuid('')
        setNome('')
    }

    useEffect(() => {
        if (isLoading) return
        if (status === 'success') setProdutos(data.results as Produto[])
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
                            isLoading &&
                            <Loading />
                        }
                        {
                            produtos.map((produto: Produto) => (
                                <div className="col-span-12 md:col-span-6 lg:col-span-4">
                                    <CardRegistros
                                        key={produto.uuid}
                                        titulo={produto.nome}
                                        uuid={produto.uuid}
                                        endpoint={'produtos'}
                                        textosDeletar={{
                                            sucesso: "a",
                                            erro: "b",
                                        }}
                                        query={'produtos'}
                                        dados={{
                                            "Código": produto.codigo ? produto.codigo : produto.uuid,
                                            "Nome": produto.nome,
                                            "Preço": produto.preco,
                                            "Unidade 1": produto.unidade1,
                                            "Quantidade 1": produto.quantidade1,
                                            "Unidade 2": produto.unidade2,
                                            "Quantidade 2": produto.quantidade2,
                                        }}
                                        onEditar={() => {
                                            setCodigo(produto.codigo)
                                            setUuid(produto.uuid)

                                            setPreco(`${produto.preco}`)

                                            setQuantidade1(produto.quantidade1)
                                            setQuantidade2(produto.quantidade2)

                                            setUnidade1(produto.unidade1)
                                            setUnidade2(produto.unidade2)
                                        }}
                                    />
                                </div>
                            ))
                        }
                        {
                            !produtos.length && !isLoading &&
                            <div className="col-span-12 md:col-span-6 lg:col-span-4">
                                <span>Não existem registros...</span>
                            </div>
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
                            <label>Nome</label>
                            <input type="text" value={nome} onChange={e => setNome(e.target.value)} />
                        </div>

                        <div className="col-span-12">
                            <label>Código</label>
                            <input type="text" value={codigo} onChange={e => setCodigo(e.target.value)} />
                        </div>

                        <div className="col-span-12">
                            <label>Preço</label>
                            <input type="text" value={preco} onChange={e => setPreco(e.target.value)} required />
                        </div>

                        <div className="col-span-12">
                            <label>Quantidade 1</label>
                            <input type="text" value={quantidade1} onChange={e => setQuantidade1(e.target.value)} required />
                        </div>

                        <div className="col-span-12">
                            <label>Unidade 1</label>
                            <input type="text" value={unidade1} onChange={e => setUnidade1(e.target.value)} required />
                        </div>

                        <div className="col-span-12">
                            <label>Quantidade 2</label>
                            <input type="text" value={quantidade2} onChange={e => setQuantidade2(e.target.value)} required />
                        </div>

                        <div className="col-span-12">
                            <label>Unidade 2</label>
                            <input type="text" value={unidade2} onChange={e => setUnidade2(e.target.value)} required />
                        </div>


                        <div className="col-span-12">
                            <Button title={uuid ? 'Salvar' : 'Cadastrar'}
                                className="btn-l flex justify-center pt-3 w-full font-bold"
                                onClick={() => !validarCampos() ? toast.error("Preencha todos os campos", DEFAULT_TOAST_CONFIG) : criarEditar.mutate()}
                            />
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}
/*
Endereço):
    codigo = models.CharField(
        max_length=30,
        verbose_name="Código do produto",
        blank=True,
        null=True,
    )

    nome = models.CharField(
        max_length=50,
        verbose_name="Nome",
    )

    cpf_cnpj = models.CharField(
        max_length=13,
        verbose_name="Código de CPF/CNPJ",
*/


