import React, {useState, useContext} from 'react';
import {css} from '@emotion/core';
// import firebase from "firebase";
import Router, {useRouter} from 'next/router';
import FileUploader from "react-firebase-file-uploader";
import Layout from '../components/layout/Layout';
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/Formulario';
import Error404 from '../components/layout/404';

import {FirebaseContext} from '../firebase';

// Validacion
import useValidacion from '../hooks/useValidacion';
import validarNuevoProducto from '../validacion/validarNuevoProducto';

const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  imagen: '',
  url: '',
  descripcion: ''
}

const NuevoProducto = () => {

  // state de imagenes
  const [nombreImagen, setNombreImagen] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [urlImagen, setUrlImagen] = useState('');

  const [error, setError] = useState(false);

  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarNuevoProducto, crearProducto);

  const {nombre, empresa, imagen, url, descripcion} = valores;

  // hook de routing para redireccionar
  const router = useRouter();

  // CRUD firebase
  const {usuario, firebase} = useContext(FirebaseContext);



  async function crearProducto(){   
    // si el usuario no esta autenticado
    if(!usuario){
      return router.push('/login');
    }

    // Objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      urlImagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName
      },
      votantes: []
    }

    // Insertar en la bd
    firebase.db.collection('productos').add(producto);

    return router.push('/');
  }

  const handleUploadStart = () => { 
    setSubiendo(true);
    setProgreso(0); 
  };

  const handleProgress = progreso => setProgreso({progreso}) ;
  
  const handleUploadError = error => {
    setSubiendo(false);
    console.error(error);
  };
  
  const handleUploadSuccess = nombre => {
    setProgreso(100);
    setSubiendo(false);
    setNombreImagen(nombre)
    firebase
      .storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL()
      .then(url => {
        setUrlImagen(url);
      });
  };


  return (
      <div>
        <Layout>
          {!usuario ? <Error404 mensaje='Tenes que registrarte para agregar un producto'/> : (
            <>
              <h1
                css={css`
                  text-align:center;
                  margin-top:5rem;
                `}
              >Nuevo producto</h1>
              <Formulario
                onSubmit={handleSubmit}
                noValidate
              >
                <fieldset>
                  <legend>Información general</legend>
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
                    <label htmlFor="empresa">Empresa</label>
                    <input 
                        type="text"
                        id="empresa"
                        placeholder="Nombre de la empresa"
                        name="empresa"
                        value={empresa}
                        onChange={handleChange} 
                        onBlur={handleBlur}
                        className={errores.empresa ? 'error' : null}
                      />
                  </Campo>
                  <Campo>
                    <label htmlFor="imagen">Imagen</label>
                    <FileUploader
                        accept="image/*"
                        randomizeFilename
                        storageRef={firebase.storage.ref("productos")}
                        onUploadStart={handleUploadStart}
                        onUploadError={handleUploadError}
                        onUploadSuccess={handleUploadSuccess}
                        onProgress={handleProgress}
                        id="imagen"
                        name="imagen"
                      />
                  </Campo>
                  <Campo>
                    <label htmlFor="url">Sitio Web</label>
                    <input 
                        type="url"
                        id="url"
                        name="url"
                        value={url}
                        placeholder={nombre ? `Ejemplo: ${nombre.replace(/\s/g, '')}.com` : 'Ejemplo: tuproducto.com'}
                        onChange={handleChange} 
                        onBlur={handleBlur}
                        className={errores.url ? 'error' : null}
                      />
                  </Campo>
                </fieldset>

                <fieldset>
                  <legend>{nombre ? `Sobre ${nombre}` : 'Sobre tu producto'}</legend>
                  <Campo>
                    <label htmlFor="descripcion">Descripción</label>
                    <textarea 
                        id="descripcion"
                        name="descripcion"
                        placeholder="Descripción de tu producto"
                        value={descripcion}
                        onChange={handleChange} 
                        onBlur={handleBlur}
                        className={errores.descripcion ? 'error' : null}
                      />
                  </Campo>              
                </fieldset>
                {errores.nombre ? <Error>{errores.nombre}</Error> : (errores.empresa ? <Error>{errores.empresa}</Error> : (errores.url) ? <Error>{errores.url}</Error> : (errores.descripcion) ? <Error>{errores.descripcion}</Error> : null)}
                {error ? <Error>{error}</Error> : null}

                <InputSubmit 
                    type="submit"
                    value="Agregar producto"
                />
              </Formulario>
            </>
          )}
        </Layout>
      </div>
  )
}

export default NuevoProducto;