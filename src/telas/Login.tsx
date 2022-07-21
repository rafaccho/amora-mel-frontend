import { useNavigate } from "react-router-dom";
import Logo from "../fotos/logo-login.png";
import Loja from "../fotos/amora-mel.jpg";
import { Button } from "../tags";

export function Login() {
    const navigate = useNavigate()
    return (
        <div className='w-screen h-screen bg-stone-800'>
            <div className="flex flex-wrap">

                <div className="w-full h-screen md:w-1/3 lg:w-1/6 bg-[#f79937] p-2">

                <div className="p-5 mb-14 md:mb-2 flex justify-center">
                        <img src={Logo} alt="Logo da Amora & Mel" />
                    </div>

                    <div className="p-2 mb-2 md:mb-5">
                        <h1 className="t-1">Login</h1>
                        <br />
                    </div>

                    <div className="p-3">
                        <div className="mb-3">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" aria-describedby="emailHelp" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="senha">Senha</label>
                            <input type="password" id="senha" />
                        </div>

                        <div className="flex justify-center w-full mt-12">
                            <Button onClick={() => navigate("/app")} className="btn-l w-full" title="Login" />
                        </div>
                    </div>

                </div>

                <div className="w-full md:w-2/3 lg:w-5/6 md:h-screen">
                    <img src={Loja} alt="Loja da Amora & Mel" className="w-full h-screen"/>
                </div>

            </div>
        </div>
    )
}