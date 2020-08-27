import React, {useState} from 'react';
import {css} from '@emotion/core';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';

import firebase from '../firebase';

// Validacion
import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';

const STATE_INICIAL = {
  nombre: '',
  email: '',
  password: ''
}

const CrearCuenta = () => {

  const [error, setError] = useState(false);

  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

  const {nombre, email, password} = valores;

  async function crearCuenta(){
    try {
      await firebase.registrar(nombre, email, password);
      Router.push('/');
    } catch (error) {
      console.error('! Error creando usuario: ', error.message);
      setError(error.message);
    }
  }

  return (
      <div>
        <Layout>
          <>
            <h1
              css={css`
                text-align:center;
                margin-top:5rem;
              `}
            >Crear cuenta</h1>
            <Formulario
              onSubmit={handleSubmit}
              noValidate
            >
              <Campo>
                <label htmlFor="nombre">Nombre</label>
                <input 
                    type="text"
                    id="nombre"
                    placeholder="Tu nombre"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange} 
                    onBlur={handleBlur}
                    className={errores.nombre ? 'error' : null}
                  />
              </Campo>
              <Campo>
                <label htmlFor="email">Email</label>
                <input 
                    type="email"
                    id="email"
                    placeholder="Tu email"
                    name="email"  
                    value={email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errores.email ? 'error' : null}
                  />
              </Campo>
              <Campo>
                <label htmlFor="password">Password</label>
                <input 
                    type="password"
                    id="password"
                    placeholder="Tu password"
                    name="password"  
                    value={password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errores.password ? 'error' : null}
                  />
              </Campo>
              {errores.nombre ? <Error>{errores.nombre}</Error> : (errores.email ? <Error>{errores.email}</Error> : (errores.password) ? <Error>{errores.password}</Error> : null)}
              {error ? <Error>{error}</Error> : null}
              <InputSubmit 
                  type="submit"
                  value="Crear cuenta"
              />
            </Formulario>
          </>
        </Layout>
      </div>
  )
}

export default CrearCuenta;