import React, {useState, useEffect} from 'react'

const useValidacion = (stateInicial, validar, fn) => {
    
    const [valores, setValores] = useState(stateInicial);
    const [errores, setErrores] = useState({});
    const [submitForm, setSubmitForm] = useState(false);
    
    useEffect(() => {
        if(submitForm){
            const noErrores = Object.keys(errores).length === 0;
            
            if(noErrores){
                fn(); // Fn = funcion que se ejecuta en el componente
            }
            setSubmitForm(false);
        }
    }, [errores]);

    // Funcion que se ejecuta en onChange cuando escribe algo
    const handleChange = (e) => {
        setValores({
            ...valores,
            [e.target.name]: e.target.value
        })
    }

    // Funcion Submit
    const handleSubmit = e => {
        e.preventDefault();
        const erroresValidacion = validar(valores);
        setErrores(erroresValidacion);
        setSubmitForm(true);
    }

    const handleBlur = () => {
        const erroresValidacion = validar(valores);
        setErrores(erroresValidacion);
    }

    return {
        valores,
        errores,
        handleSubmit,
        handleChange,
        handleBlur
    }
}
 
export default useValidacion;