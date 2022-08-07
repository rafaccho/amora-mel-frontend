import {
    BrowserRouter,
    Routes,
    Route,
    Outlet,
} from "react-router-dom";

import { MenuBar } from "./componentes/MenuBar";

import { PainelProduto as PainelProduto } from "./telas/Produtos/PainelProduto";
import { FormProduto } from "./telas/Produtos/FormProduto";

import { Login } from "./telas/Login";
import { Home } from "./telas/Home";

import { PainelAreaEntrega } from "./telas/AreaEntrega/PainelAreaEntrega";
import { FormAreaEntrega } from "./telas/AreaEntrega/FormAreaEntrega";
import { PainelFornecedor } from "./telas/Fornecedor/PainelFornecedor";
import { PainelPedidos } from "./telas/Pedidos/PainelPedidos";

export function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route path="/app/*" element={
                    <div>
                        <div className="h-screen overflow-y-auto bg-[#f7d417] lg:pl-24">
                            <Outlet />
                        </div>

                        {/* <MenuBar tipo="B" /> */}

                        <MenuBar tipo="S" />
                    </div>
                }>
                    <Route index element={<Home />} />
                    
                    <Route path="produtos/*">
                        <Route index element={<PainelProduto />} />
                        <Route path="cadastrar" element={<FormProduto />} />
                    </Route>

                    <Route path="areas-entrega/*">
                        <Route index element={<PainelAreaEntrega />} />
                        <Route path="cadastrar" element={<FormAreaEntrega />} />
                        <Route path="editar/:uuid" element={<FormAreaEntrega />} />
                    </Route>

                    <Route path="pedidos/*">
                        <Route index element={
                            <PainelPedidos />
                        } />
                    </Route>

                    <Route path="fornecedores/*">
                        <Route index element={<PainelFornecedor />} />
                    </Route>

                </Route>
            </Routes>
        </BrowserRouter>
    )
} 
