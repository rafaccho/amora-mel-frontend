import {
    BrowserRouter,
    Routes,
    Route,
    Outlet,
} from "react-router-dom";

import { SideBar } from "./componentes/SideBar";
import { BottomBar } from "./componentes/BottomBar";

import { PainelProduto as PainelProduto } from "./telas/Produtos/PainelProduto";
import { FormProduto } from "./telas/Produtos/FormProduto";

import { Login } from "./telas/Login";
import { Home } from "./telas/Home";

import { PainelAreaEntrega } from "./telas/AreaEntrega/PainelAreaEntrega";
import { FormAreaEntrega } from "./telas/AreaEntrega/FormAreaEntrega";

export function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route path="/app/*" element={
                    <div>
                        <div className="h-screen overflow-y-auto bg-[#f7d417] p-5 lg:pl-24">
                            <Outlet />
                        </div>

                        <SideBar tipo="B" />
                        <SideBar tipo="S" />
                    </div>
                }>
                    {/* <Route index element={<Home />} /> */}
                    
                    <Route path="produtos/*">
                        <Route index element={<PainelProduto />} />
                        <Route path="cadastrar" element={<FormProduto />} />
                    </Route>

                    <Route path="pedidos/*">
                        <Route index element={<><h1 className="t-1">Pedidos</h1></>} />
                    </Route>

                    <Route path="areas-entrega/*">
                        <Route index element={<PainelAreaEntrega />} />
                        <Route path="cadastrar" element={<FormAreaEntrega />} />
                    </Route>

                </Route>
            </Routes>
        </BrowserRouter>
    )
} 
