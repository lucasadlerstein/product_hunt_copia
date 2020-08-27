import React, { useEffect, useContext, useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import { FirebaseContext } from '../../firebase';
import Layout from '../../components/layout/Layout';
import Error404 from '../../components/layout/404';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';



const ContenedorProducto = styled.div`
    @media (min-width: 768px){
        display: grid; 
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: var(--naranja);
    color:#fff;
    border-radius: 5px;
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
    display:inline-block;
`;

const Producto = () => {

    const [producto, setProducto] = useState({});
    const [error, setError] = useState(false);
    const [comentario, setComentario] = useState({});
    const [consultarDB, setConsultarDB] = useState(true);

    // Obtener id actual
    const router = useRouter();
    const {query: {id}} = router;

    // firebase context
    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect(() => {
        if(id && consultarDB){
            const obtenerProducto = async () => {
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
                if(producto.exists){
                    setProducto(producto.data());
                    setConsultarDB(false);
                }else{
                    setError(true);
                    setConsultarDB(false);
                }
            }
            obtenerProducto();
        }
    }, [id, producto]);

    if(Object.keys(producto).length === 0 && !error) return 'Cargando...';

    const {votos, comentarios, creado, descripcion, empresa, nombre, url, urlImagen, creador, votantes} = producto;

    // Administrar y validar votos
    const votarProducto = () => {
        if(!usuario){
            return router.push('/login');
        }
        // Obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1;

        // Verificar si el usuario voto
        if(votantes.includes(usuario.uid)) return;

        // Guardar id del votante
        const votantesNew = [...votantes, usuario.uid];

        // BD
        firebase.db.collection('productos').doc(id).update({
            votos: nuevoTotal, votantes: votantesNew
        });

        // State
        setProducto({
            ...producto,
            votos: nuevoTotal
        });

        setConsultarDB(true);
    }

    // Comentarios
    const comentarioChange = e => {
        setComentario({
            ...comentario,
            [e.target.name]: e.target.value
        });
    }

    const esCreador = id => {
        if(id === creador.id) return true;
    }

    const agregarComentario = e => {
        e.preventDefault();
        if(!usuario){
            return router.push('/login');
        }
        // Info del comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        const nuevosComentarios = [...comentarios, comentario];

        firebase.db.collection('productos').doc(id).update({
            comentarios: nuevosComentarios
        });

        setProducto({
            ...producto,
            comentarios: nuevosComentarios
        });
        setConsultarDB(true);
    }

    // Autenticado = creador producto ?

    const puedeEliminar = () => {
        if(!usuario) return false;

        if(creador.id === usuario.uid){
            return true;
        }
    }

    const eliminarProductoDB = async () => {
        try {
            if(!usuario){
                return router.push('/login');
            }
            if(creador.id !== usuario.uid){
                return router.push('/');
            }
    
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/');
        } catch (error) {
            // console.log(error);
            return;
        }
    }

    return ( 
        <Layout>
            {error ? <Error404 mensaje="No encontramos el producto que estas buscando..." /> : (
                    <div className="contenedor">
                    <h1 css={css`
                        text-align: center;
                        margin-top: 5rem;
                    `}
                    >{nombre}</h1>
                    <ContenedorProducto>
                        <div>
                            <p>Publicado hace {formatDistanceToNow(new Date(creado), {locale:es})} por {creador.nombre} de {empresa}</p>
                            <img src={urlImagen} alt={nombre}/>
                            <p>{descripcion}</p>
    
                            {usuario ? (
                                <Fragment>
                                    <h2>Agrega un comentario</h2>
                                    <form
                                        onSubmit={agregarComentario}
                                    >
                                        <Campo>
                                            <input
                                                type="text"
                                                name="mensaje"
                                                placeholder={`"${nombre}" es...`}
                                                onChange={comentarioChange}
                                            />
                                        </Campo>
                                        <InputSubmit 
                                            type="submit"
                                            value="Comentar"
                                        />
                                    </form>
                                </Fragment>
                            ) : null}
    
                            <h2 css={css`
                                margin-top: 2rem;
                            `}
                            >Comentarios</h2>
                            {comentarios.length !== 0 ? (
                            <ul>
                                {comentarios.map((comentario, i) => (
                                    <li
                                        key={`${comentario.usuarioId}-${i}`}
                                        css={css`
                                            border: 1px solid #e1e1e1;
                                            padding: 1.5rem;
                                        `}
                                    >
                                        <p>{comentario.mensaje}</p>
                                        <p>Escrito por <span
                                            css={css`
                                                font-weight: bold;
                                            `}
                                        >{comentario.usuarioNombre}</span></p>
                                        {esCreador(comentario.usuarioId) && <CreadorProducto>Creador</CreadorProducto>}
                                    </li>
                                ))}
                            </ul>
                            ) : <p>No hay comentarios</p>}
                        </div>
                        <aside>
                            <Boton
                                target="_blank"
                                href={url}
                                bgColor="true"
                            >Visitar URL</Boton>
                            {usuario && <Boton
                                onClick={votarProducto}
                            >Votar</Boton>}
                            <p css={css`
                                text-align:center;
                            `}>{votos} votos</p>
                        </aside>
                    </ContenedorProducto>
                    {puedeEliminar() && <Boton onClick={eliminarProductoDB}>Eliminar producto</Boton>}
                </div>    
            )}
        </Layout>
     );
}
 
export default Producto;