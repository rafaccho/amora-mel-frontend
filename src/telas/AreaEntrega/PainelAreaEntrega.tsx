import { useEffect, useRef, useState } from "react";
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { toast } from "react-toastify";

import { CardRegistro } from "../../componentes/CardAreaEntrega";
import { Filtros } from "../../componentes/Filtros";
import { Loading } from "../../componentes/Loading";
import { DEFAULT_TOAST_CONFIG } from "../../constantes";

import { useBackend } from "../../hooks/useBackend";

import { AreaEntrega, Fornecedor, ViacepResponse } from "../../interfaces";
import { Button } from "../../tags";

export function PainelAreaEntrega() {
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
        cep,
    }

    const queryClient = useQueryClient()

    function getTo() {
        return fetch('https://viacep.com.br/ws/' + cep + '/json/')
    }

    const mutation = useMutation(() => uuid ? editarRegistro(uuid, dados) : criarRegistro(dados))

    const {
        data: registrosAreasDeEntrega,
        status: statusAreasEntrega,
        refetch: refreshAreasEntrega
    } = useQuery('areasEntregas', () => todosRegistros())

    const {
        data: registrosFornecedores,
        isLoading: carregandoFornecedores,
        status: statusFornecedores
    } = useQuery('fornecedores', () => todosRegistros("fornecedores"))

    function validarCampos(): boolean {
        const todosInputs = inputs.current!.querySelectorAll('input')
        const todosSelects = inputs.current!.querySelectorAll('select')

        Array.from(todosInputs).forEach(input => {
            const inputEstaValido = input.checkValidity()
            !inputEstaValido ? input.classList.add('invalidado') : input.classList.remove('invalidado')
            return inputEstaValido
        })

        Array.from(todosSelects).forEach(select => {
            const inputEstaValido = select.checkValidity()
            !inputEstaValido ? select.classList.add('invalidado') : select.classList.remove('invalidado')
            return inputEstaValido
        })

        return !(document.querySelector('.invalidado'))
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

    }, [statusAreasEntrega])

    return (
        <div className="w-full max-w-full">
            <h1 className="t-1 mb-2">Áreas de Entrega</h1>

            <div className="grid grid-cols-12 mt-12 lg:gap-12">

                <div id="registros" className="col-span-12 lg:col-span-9">
                    <Filtros refetch={refreshAreasEntrega} />

                    <div id="cards" className="grid grid-cols-12 gap-5 mt-12">
                        { statusAreasEntrega === "loading" && <Loading /> }
                        { statusAreasEntrega === "error" && <h1>Deu pau</h1> }
                        
                        {
                            !statusAreasEntrega &&
                            areasEntrega.map((areaEntrega: AreaEntrega) => (
                                <div className="col-span-12 md:col-span-6 lg:col-span-4">
                                    <CardRegistro
                                        key={areaEntrega.uuid}
                                        titulo={areaEntrega.nome}
                                        uuid={areaEntrega.uuid}
                                        endpoint={'areas_entregas'}
                                        textosDeletar={{
                                            sucesso: "a",
                                            erro: "b",
                                        }}
                                        query={'produtos'}
                                        dados={{
                                            "Código": areaEntrega.codigo ? areaEntrega.codigo : areaEntrega.uuid,
                                            "Fornecedor": `${areaEntrega.fornecedor.cpf_cnpj} - ${areaEntrega.fornecedor.nome}`,
                                            "Rua": areaEntrega.rua,
                                            "Bairro": areaEntrega.bairro,
                                            "Número": areaEntrega.numero,
                                        }}
                                        onEditar={() => {
                                            setCodigo(areaEntrega.codigo ? areaEntrega.codigo : areaEntrega.uuid)
                                            setUuid(areaEntrega.uuid)
                                            setFornecedor(`${areaEntrega.fornecedor.cpf_cnpj} - ${areaEntrega.fornecedor.nome}`)
                                            setNome(areaEntrega.nome)
                                            setRua(areaEntrega.rua)
                                            setBairro(areaEntrega.bairro)
                                            setNumero(areaEntrega.numero)
                                            setCep(areaEntrega.cep)
                                        }}
                                    />
                                </div>
                            ))
                        }
                        {
                            !areasEntrega.length && statusAreasEntrega === "success" &&
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
                            <label>Nome <i className="text-rose-700">*</i></label>
                            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
                        </div>

                        <div className="col-span-12">
                            <label>Fornecedor <i className="text-rose-700">*</i></label>
                            <select name="fornecedor" id="uf" value={fornecedor} onChange={e => setFornecedor(e.target.value)} required>
                                <option value="">Selecione</option>
                                {fornecedores.map((fornecedor: Fornecedor) => <option value={fornecedor.uuid}>{fornecedor.nome}</option>)}
                            </select>
                        </div>

                        <div className="col-span-12">
                            <label>Código</label>
                            <input type="text" value={codigo} onChange={e => setCodigo(e.target.value)} />
                        </div>

                        <div className="col-span-12">
                            <h1 className="t-3 mt-9 mb-5">Informações de Endereço</h1>
                        </div>

                        <div className="col-span-12">
                            <label>CEP <i className="text-rose-700">*</i></label>
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
                            <label>Rua <i className="text-rose-700">*</i></label>
                            <input type="text" value={rua} onChange={e => setRua(e.target.value)} required />
                        </div>

                        <div className="col-span-12">
                            <label>Estado <i className="text-rose-700">*</i></label>
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
                            <label>Bairro <i className="text-rose-700">*</i></label>
                            <input type="text" value={bairro} onChange={e => setBairro(e.target.value)} required />
                        </div>

                        <div className="col-span-12">
                            <label>Número <i className="text-rose-700">*</i></label>
                            <input type="text" value={numero} onChange={e => setNumero(e.target.value)} required />
                        </div>

                        <div className="col-span-12">
                            <label>Complemento</label>
                            <input type="text" value={complemento} onChange={e => setComplemento(e.target.value)} />
                        </div>

                        <div className="col-span-12">
                            <Button title={uuid ? 'Salvar' : 'Cadastrar'}
                                className="btn-l flex justify-center pt-3 w-full font-bold"
                                onClick={() => !validarCampos() ? toast.error("Preencha todos os campos", DEFAULT_TOAST_CONFIG) : mutation.mutate()}
                            />
                        </div>

                    </div>
                </div>


            </div>
        </div>
    )
}