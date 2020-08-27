export default function validarNuevoProducto(valores) {
    let errores = {};

    if(!valores.nombre){
        errores.nombre = 'El nombre es obligatorio';
    }
    if(!valores.empresa){
        errores.empresa = 'La empresa es obligatoria';
    }
    if(!valores.url){
        errores.url = 'El sitio web es obligatorio';
    } else if( !/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url) ){
        errores.url = 'El sitio web no es válido';
    }
    if(!valores.descripcion){
        errores.descripcion = 'La descripcion es obligatoria';
    }
    return errores;
}
