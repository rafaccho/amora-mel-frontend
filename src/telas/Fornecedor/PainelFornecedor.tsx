import { useEffect, useRef, useState } from "react";
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { toast } from "react-toastify";

import { CardRegistro } from "../../componentes/CardAreaEntrega";
import { Filtros } from "../../componentes/Filtros";
import { Loading } from "../../componentes/Loading";
import { DEFAULT_TOAST_CONFIG } from "../../constantes";

import { useBackend } from "../../hooks/useBackend";

import { Fornecedor, ViacepResponse } from "../../interfaces";
import { Button } from "../../tags";


export function PainelFornecedor() {
    const [codigo, setCodigo] = useState('')
    const [uuid, setUuid] = useState('')
    const [cpfCnpj, setCpfCnpj] = useState('')
    const [nome, setNome] = useState('')
    const [rua, setRua] = useState('')
    const [bairro, setBairro] = useState('')
    const [numero, setNumero] = useState('')
    const [cep, setCep] = useState('')
    const [complemento, setComplemento] = useState('')
    const [estado, setEstado] = useState('MG')
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])

    const inputs = useRef<HTMLDivElement>(null)

    const dados = {
        codigo,
        cpf_cnpj: cpfCnpj,
        nome,
        rua,
        bairro,
        numero,
        cep,
        complemento,
        estado,
    }

    const { criarRegistro, editarRegistro, todosRegistros, deletarRegistro } = useBackend('fornecedores')
    const queryClient = useQueryClient()
    const criarEditarFornecedor = useMutation(() => uuid ? editarRegistro(uuid, dados) : criarRegistro(dados), {
        onSuccess: () => {
            toast.success('Fornecedor salvo com sucesso!', DEFAULT_TOAST_CONFIG)
            queryClient.invalidateQueries(['fornecedores'])
            limparCampos()
        },
        onError: (err) => {
            toast.error('Ocorreu um erro!', DEFAULT_TOAST_CONFIG)
        },
    })

    const { data, isLoading, status, refetch } = useQuery('fornecedores', () => todosRegistros())

    function validarCampos(): boolean {
        const inputsForm = inputs.current!.querySelectorAll('input')
        const valido = Array.from(inputsForm).every(input => input.checkValidity())

        return valido
    }

    function limparCampos(): void {
        setCodigo('')
        setUuid('')
        setNome('')
        setRua('')
        setBairro('')
        setNumero('')
        setCep('')
        setComplemento('')
        setEstado('')
        setCpfCnpj('')
    }

    useEffect(() => {
        if (isLoading) return
        if (status === 'success') setFornecedores(data.results as Fornecedor[])
        else toast.error("Ocorreu um erro ao carregar as fornecedores", DEFAULT_TOAST_CONFIG)
    }, [isLoading, data])

    return (
        <div className="w-full max-w-full">
            <h1 className="t-1 mb-2">Fornecedores</h1>

            <div className="grid grid-cols-12 mt-12 lg:gap-12">

                <div id="registros" className="col-span-12 lg:col-span-9">
                    <Filtros refetch={refetch} />

                    <div id="cards" className="grid grid-cols-12 gap-5 mt-12">
                        {
                            isLoading &&
                            <Loading />
                        }
                        {
                            fornecedores.map((fornecedor: Fornecedor) => (
                                <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
                                    <CardRegistro
                                        key={fornecedor.uuid}
                                        titulo={fornecedor.nome}
                                        uuid={fornecedor.uuid}
                                        endpoint={'fornecedores'}
                                        textosDeletar={{
                                            sucesso: `${fornecedor.nome} excluído com sucesso!`,
                                            erro: "Ocorreu um erro ao excluir o fornecedor!",
                                        }}
                                        query={'fornecedores'}
                                        dados={{
                                            'Nome': fornecedor.nome,
                                            'CPF/CNPJ': fornecedor.cpf_cnpj,
                                            'CEP': fornecedor.cep,
                                        }}
                                        onEditar={() => {
                                            setCodigo(fornecedor.codigo ? fornecedor.codigo : fornecedor.uuid)
                                            setUuid(fornecedor.uuid)
                                            setNome(fornecedor.nome)
                                            setRua(fornecedor.rua)
                                            setBairro(fornecedor.bairro)
                                            setNumero(fornecedor.numero)
                                            setCep(fornecedor.cep)
                                        }}
                                    />
                                </div>
                            ))
                        }
                        {
                            !fornecedores.length && !isLoading &&
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
                            <label>CPF/CNPJ</label>
                            <input type="text" value={cpfCnpj} onChange={e => setCpfCnpj(e.target.value)} />
                        </div>

                        <div className="col-span-12">
                            <label>Código</label>
                            <input type="text" value={codigo} onChange={e => setCodigo(e.target.value)} />
                        </div>

                        <div className="col-span-12">
                            <h1 className="t-3 mt-9 mb-5">Informações de Endereço</h1>
                        </div>

                        <div className="col-span-12">
                            <label>CEP</label>
                            <input type="text" required
                                value={cep}
                                onChange={e => setCep(e.target.value)}
                                onBlur={async e => {
                                    if (cep.replace("-", "").length !== 8) return toast.error("CEP inválido", DEFAULT_TOAST_CONFIG)

                                    const requisicao = toast.loading('Buscando dados do CEP')

                                    fetch(`https://viacep.com.br/ws/${cep}/json/`)
                                        .then(res => {
                                            if (res.status !== 200) return toast.update(requisicao, {
                                                type: 'error',
                                                render: 'CEP não encontrado',
                                                isLoading: false,
                                            })

                                            return res.json()
                                        })
                                        .then((dadosCep: ViacepResponse) => {
                                            toast.update(requisicao, {
                                                type: 'success',
                                                render: 'Dados de endereço carregados',
                                                ...DEFAULT_TOAST_CONFIG
                                            })

                                            setRua(dadosCep.logradouro)
                                            setBairro(dadosCep.bairro)
                                            setEstado(dadosCep.uf)
                                        })
                                }}
                            />
                        </div>

                        <div className="col-span-12">
                            <label>Rua</label>
                            <input type="text" value={rua} onChange={e => setRua(e.target.value)} required />
                        </div>

                        <div className="col-span-12">
                            <label>Estado</label>
                            <select name="uf" id="uf" value={estado} onChange={e => setEstado(e.target.value)} required >
                                <option value="AC">Acre</option>
                                <option value="AL">Alagoas</option>
                                <option value="AP">Amapá</option>
                                <option value="AM">Amazonas</option>
                                <option value="BA">Bahia</option>
                                <option value="CE">Ceará</option>
                                <option value="DF">Distrito Federal</option>
                                <option value="ES">Espírito Santo</option>
                                <option value="EX">Exterior</option>
                                <option value="GO">Goiás</option>
                                <option value="MA">Maranhão</option>
                                <option value="MT">Mato Grosso</option>
                                <option value="MS">Mato Grosso do Sul</option>
                                <option value="MG">Minas Gerais</option>
                                <option value="PA">Pará</option>
                                <option value="PB">Paraíba</option>
                                <option value="PR">Paraná</option>
                                <option value="PE">Pernambuco</option>
                                <option value="PI">Piauí</option>
                                <option value="RJ">Rio de Janeiro</option>
                                <option value="RN">Rio Grande do Norte</option>
                                <option value="RS">Rio Grande do Sul</option>
                                <option value="RO">Rondônia</option>
                                <option value="RR">Roraima</option>
                                <option value="SC">Santa Catarina</option>
                                <option value="SP">São Paulo</option>
                                <option value="SE">Sergipe</option>
                                <option value="TO">Tocantins</option></select>
                        </div>

                        <div className="col-span-12">
                            <label>Bairro</label>
                            <input type="text" value={bairro} onChange={e => setBairro(e.target.value)} required />
                        </div>

                        <div className="col-span-12">
                            <label>Número</label>
                            <input type="text" value={numero} onChange={e => setNumero(e.target.value)} required />
                        </div>

                        <div className="col-span-12">
                            <label>Complemento</label>
                            <input type="text" value={complemento} onChange={e => setComplemento(e.target.value)} />
                        </div>

                        <div className="col-span-12">
                            <Button title={uuid ? 'Salvar' : 'Cadastrar'}
                                className="btn-l flex justify-center pt-3 w-full font-bold"
                                onClick={() => !validarCampos() ? toast.error("Preencha todos os campos", DEFAULT_TOAST_CONFIG) : criarEditarFornecedor.mutate()}
                            />
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}
