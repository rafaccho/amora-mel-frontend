import React from "react"

export function useValidacaoFormulario() {
    function validarCampos(inputs: React.RefObject<HTMLDivElement>): boolean {
        const todosInputs = inputs.current!.querySelectorAll('input')
        Array.from(todosInputs).forEach(input => {
            const inputEstaValido = input.checkValidity()
            !inputEstaValido ? input.classList.add('invalidado') : input.classList.remove('invalidado')
            return inputEstaValido
        })

        return !(document.querySelector('.invalidado'))
    }
    return {
        validarCampos
    }
}