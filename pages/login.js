import React, {useState} from 'react';
import {css} from '@emotion/core';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';

import firebase from '../firebase';

// Validacion
import useValidacion from '../hooks/useValidacion';
import validarLogin from '../validacion/validarLogin';

const STATE_INICIAL = {
  email: '',
  password: ''
}

const Login = () => {

  const [error, setError] = useState(false);

  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarLogin, iniciarSesion);

  const {email, password} = valores;

  async function iniciarSesion() {
    try {
      await firebase.login(email, password);
      Router.push('/');
    } catch (error) {
      console.error('! Error en login: ', error.message);
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
            >Iniciar sesión</h1>
            <Formulario
              onSubmit={handleSubmit}
              noValidate
            >
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
              {errores.email ? <Error>{errores.email}</Error> : (errores.password) ? <Error>{errores.password}</Error> : null}
              {error ? <Error>{error}</Error> : null}
              <InputSubmit 
                  type="submit"
                  value="Iniciar sesion"
              />
            </Formulario>
          </>
        </Layout>
      </div>
  )
}

export default Login;