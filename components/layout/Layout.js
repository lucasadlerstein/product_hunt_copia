import React, {Fragment} from 'react';
import Header from './Header';
import {Global, css} from '@emotion/core';
import Head from 'next/head';

const Layout = props => {
    return ( 
        <Fragment>
            <Global
                styles={css`
                    :root {
                        --gris: #3d3d3d;
                        --grisDos: #6f6f6f;
                        --grisTres: #e1e1e1;
                        --naranja: #da55df;
                        --fuentePrincipal: 'Roboto Slab', serif;
                        --fuenteSecundaria: 'PT Sans', sans-serif;
                    }
                    html{
                        font-size: 62.5%;
                        box-sizing: border-box;
                    }
                    *, *:before, *:after{
                        box-sizing: inherit;
                    }
                    body{
                        font-size: 1.6rem;
                        line-height: 1.5;
                        font-family: var(--fuenteSecundaria);
                    }
                    h1, h2, h3{
                        margin: 0 0 2rem 0;
                        line-height: 1.5;
                    }
                    h1, h2{
                        font-family: var(--fuentePrincipal);
                        font-weight: 700;
                    }
                    h3{
                        font-family: var(--fuenteSecundaria);
                    }
                    ul{
                        list-style: none;
                        margin: 0;
                        padding: 0;
                    }
                    a{
                        text-decoration: none;
                    }
                    .error{
                        border: 1px solid red!important;
                    }
                    img {
                        max-width: 100%;
                    }
                `}
            />
            <Head>
                <title>Product Hunt Firebase y Next</title>
                <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Roboto+Slab:wght@400;700&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" cross0rigin="anonymous" />
                <link href="/static/css/app.css" rel="stylesheet"/>
            </Head>

            <Header />

            <main>
                {props.children}
            </main>
        </Fragment>
     );
}
 
export default Layout;