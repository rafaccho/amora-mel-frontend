import { Estado, PedidoStatus, SimNao, UnidadeLoja } from "../tipos"

export interface BackendResponse {
    count: number
    next: string | null
    previous: string | null
    results: any[]
}

export interface Base {
    uuid: string
    ativo: SimNao
    data_criacao: string
    hora_criacao: string
}

export interface Endereco {
    cep: string
    rua: string
    bairro: string
    numero: string
    complemento: string
    estado: Estado
    cidade: string
}

export interface Produto extends Base {
    codigo: string
    nome: string
    unidade1: string
    unidade2: string
    quantidade1: number
    quantidade2: number
}

export interface Fornecedor extends Base, Endereco {
    codigo: string
    nome: string
    cpf_cnpj: string
}

export interface AreaEntrega extends Base, Endereco {
    codigo: string
    nome: string
    fornecedor: string //| Fornecedor
}

export interface Pedido extends Base {
    loja: UnidadeLoja
    produto: string
    quantidade: number
    area_entrega: string
    status: PedidoStatus
}


export interface Agrupamento extends Base {
    codigo: string
    nome: string
    descricao: string
    grupo: string
}

/*  */

export interface ViacepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
}

/*  */

export interface ExibicaoDadoConfig {
    coluna: string,
    chaveApi: string,
    mascara?: () => void,
}