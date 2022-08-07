import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'
import { useQuery } from 'react-query'
import { useBackend } from "../../hooks/useBackend"
import { Button } from '../../tags'
import { Endpoint } from "../../tipos"
import { Filtros } from '../Filtros'
import { ExibicaoDadoConfig } from "../../interfaces";

export function Grid(props: {
    exibicaoDadosConfig: ExibicaoDadoConfig[],
    requisicaoConfig: {
        endpoint: Endpoint,
    }
}) {
    const { todosRegistros } = useBackend(props.requisicaoConfig.endpoint)
    const query = useQuery(props.requisicaoConfig.endpoint, () => todosRegistros())

    return (
        <div id={`grid-${props.requisicaoConfig.endpoint}`} className="w-full">
            <Filtros refetch={() => ''} />

            <div className="my-8" />

            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto">
                    <div className="py-2 align-middle inline-block min-w-full"> {/*  sm:px-6 lg:px-8 */}
                        <div className="shadow overflow-hidden border-b border-gray-200 rounded-lg">

                            <table className="min-w-full divide-y divide-gray-200">

                                <thead className="bg-gray-600">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs text-j-white font-extrabold uppercase tracking-wider whitespace-nowrap">Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs text-j-white font-extrabold uppercase tracking-wider whitespace-nowrap">Identificador</th>

                                        {
                                            props.exibicaoDadosConfig.map((dadoExibicao: ExibicaoDadoConfig) => (
                                                <th scope="col" className="px-6 py-3 text-left text-xs text-j-white font-extrabold uppercase tracking-wider whitespace-nowrap">
                                                    {dadoExibicao.coluna}
                                                </th>
                                            ))
                                        }

                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {
                                        query.data?.data.results.map((registro: any) => (
                                            <tr key={registro.uuid} className="bg-gray-700 text-j-white">

                                                <td className="coluna-grid text-sm font-medium" />
                                                <td className="coluna-grid text-sm font-medium truncate">{registro.uuid}</td>

                                                {
                                                    props.exibicaoDadosConfig.map((dadoExibicao: ExibicaoDadoConfig) => (
                                                        <td className="coluna-grid"> <span className="text-sm font-medium">
                                                            {registro[dadoExibicao.chaveApi]}
                                                        </span></td>
                                                    ))
                                                }

                                            </tr>
                                        ))
                                    }
                                </tbody>

                            </table>

                        </div>
                    </div>
                </div>
            </div>

            <div className="my-8" />

            <div className="grid grid-cols-12">
                <div className="col-span-12 flex justify-center md:justify-end gap-16">
                    <Button className="btn-l w-24 flex justify-center pt-3" title={<AiOutlineArrowLeft />} />
                    <span className='font-bold font-sans'>1 de 1</span>
                    <Button className="btn-l w-24 flex justify-center pt-3" title={<AiOutlineArrowRight />} />
                </div>
            </div>

        </div>
    )
}