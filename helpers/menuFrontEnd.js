const getMenuFrontEnd = ( role = 'USER_ROLE' ) => {
  const menu = [
    {
      title: 'Dashboard',
      icon: 'mdi mdi-gauge',
      submenu: [
        { title: 'Main', url: '/' },
        { title: 'ProgressBar', url: 'progress' },
        { title: 'Graphic', url: 'grafica1' },
        { title: 'Promesas', url: 'promesas' },
        { title: 'Rxjs', url: 'rxjs' },
      ]
    },
    {
      title: 'Mantenimientos',
      icon: 'mdi mdi-folder-lock-open',
      submenu: [
        // { title: 'Usuarios', url: 'users' },
        { title: 'Hospitales', url: 'hospitals' },
        { title: 'Doctores', url: 'doctors' },
      ]
    }
  ];

  if ( role === 'ADMIN_ROLE') {
    menu[1].submenu.unshift( { title: 'Usuarios', url: 'users' } );
  }

  return menu;
}

module.exports = {
  getMenuFrontEnd
}