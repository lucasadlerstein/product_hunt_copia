import React, {Fragment, useContext} from 'react';
import Buscar from '../ui/Buscar';
import Navegacion from './Navegacion';
import Link from 'next/link';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Boton from '../ui/Boton';
import {FirebaseContext} from '../../firebase';

const ContenedorHeader = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    width: 95%;
    @media (min-width: 768px){
        display: flex;
        justify-content: space-between;
    }
`;

const Logo = styled.a`
    color: var(--naranja);
    font-size: 4rem;
    line-height: 0;
    font-weight: 700;
    font-family: var(--fuentePrincipal);
    margin-right: 2rem;
    cursor: pointer;
`;

const Header = () => {

    const {usuario, firebase} = useContext(FirebaseContext);

    return ( 
        <header
            css={css`
                border-bottom: 2px solid var(--grisTres);
                padding: 1rem 0;
            `}
        >
            <ContenedorHeader>
                <div
                    css={css`
                        display: flex;
                        align-items: center;
                    `}
                >
                    <Link href="/">
                        <Logo>P</Logo>
                    </Link>
                    <Buscar />
                    <Navegacion />
                </div>
                <div
                    css={css`
                        display: flex;
                        align-items: center;
                    `}
                >
                    {usuario ? (
                        <Fragment>
                            <p
                            css={css`
                                margin-right: 2rem;
                            `}
                            >Hola {usuario.displayName}</p>
                            <Boton
                                bgColor="true"
                                onClick={() => firebase.cerrarSesion()}
                            >Cerrar sesion</Boton>
                        </Fragment>
                    ) : (
                    <Fragment>
                        <Link href="/login">
                            <Boton
                                bgColor="true"
                            >Iniciar sesion</Boton>
                        </Link>
                        <Link href="/crear-cuenta">
                            <Boton>Crear cuenta</Boton>
                        </Link>
                    </Fragment>
                    )}
                </div>
            </ContenedorHeader>
        </header>
     );
}
 
export default Header;