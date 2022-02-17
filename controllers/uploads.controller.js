const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { updateImage } = require('../helpers/updateImage');

const fileUpload = async (req, res = response) => {
  const type = req.params.type;
  const id = req.params.id;

  //Validar tipo
  const validTypes = [ 'doctors', 'hospitals', 'users'];
  if ( !validTypes.includes(type) ) {
    return res.status(400).json({
      ok: false,
      msj: 'No es un tipo válido'
    });
  }

  //Validar que exista archivo
  if ( !req.files || Object.keys(req.files).length === 0 ) {
    return res.status(400).json({
      ok: false,
      msj: 'No files were uploaded.'
    });
  }

  //Procesar la imagen...
  const file = req.files.image;
  const nameCutOff = file.name.split('.');
  const fileExtension = nameCutOff.pop();

  //Validar extensión 
  const validFileExtensions = [ 'png', 'jpg', 'jpeg', 'gif' ];
  if ( !validFileExtensions.includes(fileExtension) ) {
    return res.status(400).json({
      ok: false,
      msj: 'Not an allowed extension.'
    });
  }

  //Generar nombre del archivo
  const fileName = `${ uuidv4() }.${fileExtension}`

  //Path para guardar la imagen
  const path = `./uploads/${ type }/${ fileName }`;

  //Mover la imagen
  file.mv( path, (err) => {
    if ( err ) {
      console.log(err);
      return res.status(500).json({
        ok: false,
        msj: 'Error al mover la imagen.'
      });
    }

    //Actualizar DB
    updateImage( type, id, fileName );

    res.json({
      ok: true,
      msj: 'File uploaded!',
      fileName
    });
  });
}

const getImage = ( req, res = response ) => {
  const type = req.params.type;
  const image = req.params.image;

  const pathImg = path.join( __dirname, `../uploads/${ type }/${ image }`);

  //Default image
  if ( fs.existsSync( pathImg )) {
    //Para que no responda un json y nos mande el archivo
    res.sendFile( pathImg );
  } else {
    const pathImg = path.join( __dirname, `../uploads/no-img.jpg`);
    res.sendFile( pathImg );
  }
  
}

module.exports = {
  fileUpload,
  getImage
}