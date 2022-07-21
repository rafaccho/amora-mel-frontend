import { useEffect, useRef, useState } from "react";
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TiArrowBackOutline } from 'react-icons/ti'

import { DEFAULT_TOAST_CONFIG } from "../../constantes";
import { useBackend } from "../../hooks/useBackend";
import { AreaEntrega, Fornecedor, ViacepResponse } from "../../interfaces";
import { Button } from "../../tags";


export function FormAreaEntrega() {
    const [codigo, setCodigo] = useState('')
    const [uuid, setUuid] = useState('')
    const [nome, setNome] = useState('')
    const [fornecedor, setFornecedor] = useState('')

    const [rua, setRua] = useState('')
    const [bairro, setBairro] = useState('')
    const [numero, setNumero] = useState('')
    const [cep, setCep] = useState('')
    const [complemento, setComplemento] = useState('')
    const [estado, setEstado] = useState('MG')

    const [areasEntrega, setAreasEntrega] = useState<AreaEntrega[]>([])
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])

    const inputs = useRef<HTMLDivElement>(null)

    const { criarRegistro, editarRegistro, todosRegistros } = useBackend('areas_entregas')

    const dados = {
        nome,
        codigo,
        fornecedor,
        rua,
        bairro,
        numero,
    }

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const mutation = useMutation(() => uuid ? editarRegistro(uuid, dados) : criarRegistro(dados), {
        onSuccess: () => {
            toast.success('Registro salvo com sucesso!', DEFAULT_TOAST_CONFIG)
            queryClient.invalidateQueries(['areasEntregas'])
            limparCampos()
        },
        onError: (err) => {
            toast.error('Ocorreu um erro!', DEFAULT_TOAST_CONFIG)
        },
    })

    const { data, isLoading, status } = useQuery('areasEntregas', () => todosRegistros())

    function validarCampos(): boolean {
        const fork = inputs.current!.querySelectorAll('input')
        const valido = Array.from(fork).every(input => input.checkValidity())

        return valido
    }

    function limparCampos(): void {
        setCodigo('')
        setUuid('')
        setNome('')
        setFornecedor('')
        setRua('')
        setBairro('')
        setNumero('')
        setCep('')
        setComplemento('')
        setEstado('MG')
    }

    useEffect(() => {
        if (isLoading) return
        if (status === 'success') setAreasEntrega(data.results as AreaEntrega[])
        else toast.error("Ocorreu um erro ao carregar as áreas de entrega", DEFAULT_TOAST_CONFIG)
    }, [isLoading, data])
    return (
        <div ref={inputs} id="formulario" className="w-full">
            <h1 className="t-1 mb-6">Área de Entega</h1>

            <div className="w-full flex mb-12 gap-4 sticky bottom-0">
                <Button title={<><TiArrowBackOutline size={22} /> Voltar</>}
                    className="btn-l flex justify-center pt-3 font-bold w-1/3"
                    onClick={() => navigate('/app/areas-entrega')}
                />
                <Button title={uuid ? 'Salvar' : 'Cadastrar'}
                    className="btn-l flex justify-center pt-3 font-bold w-2/3"
                    onClick={() => !validarCampos() ? toast.error("Preencha todos os campos", DEFAULT_TOAST_CONFIG) : mutation.mutate()}
                />
            </div>

            <div className="inputs">

                <div className="col-span-12">
                    <label>Identificador </label>
                    <input type="text" value={uuid} readOnly disabled />
                </div>

                <div className="col-span-12">
                    <label>Código</label>
                    <input type="text" value={codigo} onChange={e => setCodigo(e.target.value)} />
                </div>

                <div className="col-span-12">
                    <label>Nome</label>
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
                </div>

                <div className="col-span-12">
                    <label>Fornecedor</label>
                    <select name="fornecedor" id="uf" value={estado} onChange={e => setEstado(e.target.value)} required>
                        {
                            fornecedores.length !== 0
                                ? <option defaultValue="">Nenhum cadastrado</option>
                                : <option defaultValue="">Selecione</option>
                        }
                        {
                            fornecedores.map((fornecedor: Fornecedor) => (<option value="DF">Distrito Federal</option>))
                        }
                    </select>
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
                                    setCep(dadosCep.cep)
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

            </div>
        </div>
    )
}