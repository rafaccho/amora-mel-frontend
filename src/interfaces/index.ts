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

    data_ultima_atualizacao: string
    hora_ultima_atualizacao: string
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
    estoque_minimo: number
    grupo?: Agrupamento
    subgrupo?: Agrupamento
}

export interface Fornecedor extends Base, Endereco {
    codigo: string
    nome: string
    cpf_cnpj: string
    area_entrega: AreaEntrega
}

export interface AreaEntrega extends Base, Endereco {
    codigo: string
    nome: string
    fornecedor: string //| Fornecedor
    google_maps_url: string
}

export interface Pedido extends Base {
    loja: UnidadeLoja
    produto: Produto
    quantidade: number
    area_entrega: string
    status: PedidoStatus
}

export interface PedidoItem extends Base {
    produto: Produto
    comprado: SimNao
    fornecedor?: Fornecedor
    quantidade: string
}

export interface Agrupamento extends Base {
    codigo: string
    nome: string
    descricao: string
    grupo: string
}

export interface ProdutoFornecedor extends Base {
    produto: Produto
    fornecedor: Fornecedor
}

export interface ProdutoAbaixoEstoqueMinimo extends Base {
    produto: string// produto: Produto
    estoque_minimo: string
    em_estoque: string
}

/* Interfaces de response de API's externas */

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

/* Interfaces de componenntes */

export interface ExibicaoDadoGridConfig {
    coluna: string,
    chaveApi: string,
    mascara?: () => void,
}