import { useEffect, useRef, useState } from "react";
import { useQueryClient, useMutation, useQuery } from 'react-query'
import { toast } from "react-toastify";

import { CardRegistro } from "../../componentes/CardAreaEntrega";
import { Filtros } from "../../componentes/Filtros";
import { Loading } from "../../componentes/Loading";
import { Error } from "../../componentes/Error";
import { DEFAULT_TOAST_CONFIG } from "../../constantes";

import { useBackend } from "../../hooks/useBackend";

import { Fornecedor, ViacepResponse } from "../../interfaces";
import { Button } from "../../tags";
import { Grid } from "../../componentes/Grid";


export function PainelPedidos() {
    const { criarRegistro, editarRegistro, todosRegistros } = useBackend('fornecedores')

    return (
        <div className="w-full max-w-full p-5">
            <h1 className="t-1 mb-2">Pedidos</h1>

                <div className="grid grid-cols-1 mt-12">

                <div id="registros" className="col-span-1">
                    {/* <Filtros refetch={() => ''} /> */}

                    <Grid
                        exibicaoDadosConfig={[
                            { coluna: 'Fornecedor', chaveApi: 'fornecedor', mascara: () => '' },
                            { coluna: 'Produto', chaveApi: 'produto' },
                            { coluna: 'quantidade', chaveApi: 'quantidade' },
                        ]}
                        requisicaoConfig={{
                            endpoint: 'pedidos',
                        }}
                    />
                </div>

            </div>
        </div>
    )
}
