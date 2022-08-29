import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import { MenuBar } from "./componentes/MenuBar";
import { Painel } from "./componentes/Painel";

import { Login } from "./telas/Login";
import { Home } from "./telas/Home";

import { FormAreaEntrega } from "./telas/FormAreaEntrega";
import { FormFornecedor } from "./telas/FormFornecedor";
import { FormPedidos } from "./telas/FormPedidos";
import { FormAgrupamentos } from "./telas/FormAgrupamentos";
import { FormProduto } from "./telas/FormProduto";
import { FormEstoque } from "./telas/FormEstoque";
import { VisualizacaoPedido } from "./telas/VisualizacaoPedido";

export function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route path="/app/*" element={
                    <div>
                        <div className="h-screen overflow-y-auto bg-blue-50 lg:pl-20">
                            <Outlet />
                        </div>

                        <MenuBar />
                    </div>
                }>

                    <Route index element={<Home />} />

                    <Route path="visualizar-pedido/:uuid/" element={<VisualizacaoPedido />} />

                    <Route path="produtos/*">
                        <Route index element={
                            <Painel
                                titulo="Produtos"
                                grid={{
                                    exibicaoDadosConfig: [
                                        { coluna: 'Codigo', chaveApi: 'codigo' },
                                        { coluna: 'Nome', chaveApi: 'nome' },
                                        { coluna: 'Unidade 1', chaveApi: 'unidade1' },
                                        { coluna: 'Quantidade 1', chaveApi: 'quantidade1' },
                                        { coluna: 'Unidade 2', chaveApi: 'unidade2' },
                                        { coluna: 'Quantidade 2', chaveApi: 'quantidade2' },
                                    ],
                                    requisicaoConfig: {
                                        endpoint: 'produtos',
                                    }
                                }}
                            />
                        } />
                        <Route path="cadastrar" element={<FormProduto />} />
                        <Route path="editar/:uuidEdit/" element={<FormProduto />} />
                    </Route>

                    <Route path="areas-entrega/*">
                        <Route index element={<Painel
                                titulo="Áreas de Entrega"
                                grid={{
                                    exibicaoDadosConfig: [
                                        { coluna: 'CEP', chaveApi: 'cep' },
                                    ],
                                    requisicaoConfig: {
                                        endpoint: 'areas_entregas',
                                    }
                                }}
                            />} />
                        <Route path="cadastrar" element={<FormAreaEntrega />} />
                        <Route path="editar/:uuidEdit" element={<FormAreaEntrega />} />
                    </Route>

                    <Route path="pedidos/*">
                        <Route index element={
                            <Painel
                                titulo="Pedidos"
                                grid={{
                                    exibicaoDadosConfig: [
                                        { coluna: 'Fornecedor', chaveApi: 'fornecedor', mascara: () => '' },
                                        { coluna: 'Produto', chaveApi: 'produto' },
                                        { coluna: 'Quantidade', chaveApi: 'quantidade' },
                                    ],
                                    requisicaoConfig: {
                                        endpoint: 'pedidos',
                                    }
                                }}
                            />
                        } />
                        <Route path="cadastrar" element={<FormPedidos />} />
                        <Route path="editar/:uuidEdit" element={<FormPedidos />} />
                    </Route>

                    <Route path="fornecedores/*">
                        <Route index element={
                            <Painel
                                titulo="Fornecedores"
                                grid={{
                                    exibicaoDadosConfig: [
                                        { coluna: 'Codigo', chaveApi: 'codigo' },
                                        { coluna: 'Nome', chaveApi: 'nome' },
                                        { coluna: 'CPF/CNPJ', chaveApi: 'cpf_cnpj' },
                                        { coluna: 'CEP', chaveApi: 'cep' },
                                        { coluna: 'Bairro', chaveApi: 'bairro' },
                                        { coluna: 'Rua', chaveApi: 'rua' },
                                    ],
                                    requisicaoConfig: {
                                        endpoint: 'fornecedores',
                                    }
                                }}
                            />
                        } />
                        <Route path="cadastrar" element={<FormFornecedor />} />
                        <Route path="editar/:uuidEdit" element={<FormFornecedor />} />
                    </Route>

                    <Route path="grupos/*">
                        <Route index element={
                            <Painel
                                titulo="Grupos de Produtos"
                                grid={{
                                    exibicaoDadosConfig: [
                                        { coluna: 'Codigo', chaveApi: 'codigo' },
                                        { coluna: 'Nome', chaveApi: 'nome' },
                                        { coluna: 'Descrição', chaveApi: 'descricao' },
                                    ],
                                    requisicaoConfig: {
                                        endpoint: 'agrupamentos',
                                        filtros: "entidade=G"
                                    }
                                }}
                            />
                        } />
                        <Route path="cadastrar" element={<FormAgrupamentos entidade="G" />} />
                        <Route path="editar/:uuidEdit" element={<FormAgrupamentos entidade="G" />} />
                    </Route>

                    <Route path="subgrupos/*">
                        <Route index element={
                            <Painel
                                titulo="Subgrupos de Produtos"
                                grid={{
                                    exibicaoDadosConfig: [
                                        { coluna: 'Codigo', chaveApi: 'codigo' },
                                        { coluna: 'Nome', chaveApi: 'nome' },
                                        { coluna: 'Descrição', chaveApi: 'descricao' },
                                        { coluna: 'Grupo', chaveApi: 'grupo' },
                                    ],
                                    requisicaoConfig: {
                                        endpoint: 'agrupamentos',
                                        filtros: "entidade=S"

                                    }
                                }}
                            />
                        } />
                        <Route path="cadastrar" element={<FormAgrupamentos entidade="S" />} />
                        <Route path="editar/:uuidEdit" element={<FormAgrupamentos entidade="S" />} />
                    </Route>

                    <Route path="estoques/*">
                        <Route index element={
                            <Painel
                                titulo="Estoque"
                                grid={{
                                    exibicaoDadosConfig: [
                                        { coluna: 'Produto', chaveApi: 'produto' },
                                        { coluna: 'Quantidade', chaveApi: 'quantidade' },
                                    ],
                                    requisicaoConfig: {
                                        endpoint: 'estoques',
                                    }
                                }}
                            />
                        } />
                        <Route path="cadastrar" element={<FormEstoque />} />
                        <Route path="editar/:uuidEdit" element={<FormEstoque />} />
                    </Route>

                </Route>
            </Routes>
        </BrowserRouter>
    )
} 