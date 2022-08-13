import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Logo from "../fotos/logo-login.png";
import Loja from "../fotos/amora-mel.jpg";

import { useBackend } from "../hooks/useBackend";
import { useValidacao } from "../hooks/useValidacao";

import { Button } from "../tags";
import { toast } from "react-toastify";
import { DEFAULT_TOAST_CONFIG } from "../constantes";

export function Login() {
    const [usuario, setUsuario] = useState("")
    const [senha, setSenha] = useState("")

    const txtUsuario = useRef<HTMLInputElement>(null)
    const txtSenha = useRef<HTMLInputElement>(null)

    const navigate = useNavigate()
    const { login } = useBackend("login")
    const { validarCampo } = useValidacao()

    function logar() {
        validarCampo(txtUsuario.current)
        validarCampo(txtSenha.current)

        !document.querySelector('.invalidado')
            ? login({ usuario, senha }).then(res => {
                if(res.status !== 200) return toast.error("Usuário ou senha inválidos", DEFAULT_TOAST_CONFIG)

                navigate("/app/")
                toast.success("Bem vindo!", DEFAULT_TOAST_CONFIG)
            })
            : toast.error("Preencha todos os campos", DEFAULT_TOAST_CONFIG)
    }

    return (
        <div className='w-screen h-screen bg-stone-800'>
            <div className="flex flex-wrap">

                <div className="w-full h-screen md:w-1/3 lg:w-1/6 bg-blue-400 p-2">

                    <div className="p-2 mb-2 md:mb-5 my-12">
                        <h1 className="t-1">Login</h1>
                    </div>

                    <div className="p-3">
                        <div className="mb-3">
                            <label htmlFor="Usuario">Usuário</label>
                            <input type="Usuario" id="Usuario" required
                                ref={txtUsuario}
                                value={usuario}
                                onChange={e => setUsuario(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && logar()}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="senha">Senha</label>
                            <input type="password" id="senha" required
                                ref={txtSenha}
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && logar()}
                            />
                        </div>

                        <div className="flex justify-center w-full mt-12">
                            <Button onClick={() => logar()} className="botao-blue-1 w-full" title="Login" />
                        </div>
                    </div>

                </div>

                <div className="w-full md:w-2/3 lg:w-5/6 md:h-screen">
                    <img src={Loja} alt="Loja da Amora & Mel" className="w-full h-screen" />
                </div>

            </div>
        </div>
    )
}