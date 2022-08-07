import { FiRefreshCw } from 'react-icons/fi'
import { BsSearch } from 'react-icons/bs'
import { AiOutlineArrowRight, AiOutlineArrowLeft } from 'react-icons/ai'

import { useNavigate } from 'react-router-dom';

import { Button } from "../../tags";
import { useState } from 'react';
import { toast } from 'react-toastify';
import { DEFAULT_TOAST_CONFIG } from '../../constantes';

export function Filtros(props: { refetch?: any, urlCadastrar?: string, state?: any }) {
    const navigate = useNavigate()

    return (
        <div id="filtros">
            <div className="grid grid-cols-12 gap-5">

                <div className="col-span-12 md:col-span-12 lg:col-span-8">
                    <input type="text" placeholder="Pesquise qualquer coisa..."
                        // value={props.state.state} onChange={(e) => {props.state.setState(e.target.value)}}
                    />
                </div>

                <div className="flex lg:hidden justify-center md:justify-end col-span-12 md:col-span-4">
                    <Button onClick={() => navigate(props.urlCadastrar ? props.urlCadastrar : 'cadastrar/')} className="btn-l w-full font-bold" title="Adicionar" />
                </div>

                <div className="flex justify-center md:justify-end col-span-6 md:col-span-4 lg:col-span-2">
                    <Button className="btn-l pb-3 w-full flex justify-center pt-3 font-bold" title={<BsSearch />}
                        onClick={() => {
                            const promise = toast.loading("Carregando 1...", DEFAULT_TOAST_CONFIG)
                            props.refetch('teste=123&teste2=12')
                            console.log(props.refetch)
                        }}
                    />
                </div>

                <div className="flex justify-center md:justify-end col-span-6 md:col-span-4 lg:col-span-2">
                    <Button className="btn-l pb-3 w-full flex justify-center pt-3 font-bold" title={<FiRefreshCw />}
                        onClick={() => {
                            const promise = toast.loading("Carregando 2...", DEFAULT_TOAST_CONFIG)
                            props.refetch('teste=123&teste2=12')
                        }}
                    />
                </div>

                {/* <div className="col-span-12 md:col-span-12 lg:col-span-12 flex justify-between lg:gap-12 md:mt-12 lg:mt-0">
                    <Button className="btn-l w-24 flex justify-center pt-3" onClick={() => props.refetch()} title={<AiOutlineArrowLeft />} />
                    <span className='font-bold font-sans'>1 de 1</span>
                    <Button className="btn-l w-24 flex justify-center pt-3" onClick={() => props.refetch()} title={<AiOutlineArrowRight />} />
                </div> */}

            </div>
        </div>
    )
}