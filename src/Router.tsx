import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import { MenuBar } from "./componentes/MenuBar";

import { Login } from "./telas/Login";
import { Home } from "./telas/Home";

import { PainelProduto } from "./telas/Produtos/PainelProduto";
import { FormProduto } from "./telas/Produtos/FormProduto";

import { PainelAreaEntrega } from "./telas/AreaEntrega/PainelAreaEntrega";
import { FormAreaEntrega } from "./telas/AreaEntrega/FormAreaEntrega";

import { PainelFornecedor } from "./telas/Fornecedor/PainelFornecedor";
import { FormFornecedor } from "./telas/Fornecedor/FormFornecedor";

import { PainelPedidos } from "./telas/Pedidos/PainelPedidos";
import { FormPedidos } from "./telas/Pedidos/FormPedidos";

export function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route path="/app/*" element={
                    <div>
                        <div className="h-screen overflow-y-auto bg-[#f7d417] lg:pl-20">
                            <Outlet />
                        </div>

                        <MenuBar tipo="S" />
                        <MenuBar tipo="B" />
                    </div>
                }>
                    <Route index element={<Home />} />
                    
                    <Route path="produtos/*">
                        <Route index element={<PainelProduto />} />
                        <Route path="cadastrar" element={<FormProduto />} />
                        <Route path="editar/:uuidEdit/" element={<FormProduto />} />
                    </Route>

                    <Route path="areas-entrega/*">
                        <Route index element={<PainelAreaEntrega />} />
                        <Route path="cadastrar" element={<FormAreaEntrega />} />
                        <Route path="editar/:uuidEdit" element={<FormAreaEntrega />} />
                    </Route>

                    <Route path="pedidos/*">
                        <Route index element={ <PainelPedidos /> } />
                        <Route path="cadastrar" element={<FormPedidos />} />
                        <Route path="editar/:uuidEdit" element={<FormPedidos />} />
                    </Route>

                    <Route path="fornecedores/*">
                        <Route index element={<PainelFornecedor />} />
                        <Route path="cadastrar" element={<FormFornecedor />} />
                        <Route path="editar/:uuidEdit" element={<FormFornecedor />} />
                    </Route>

                </Route>
            </Routes>
        </BrowserRouter>
    )
} 
