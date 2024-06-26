export const columnsEquipo = [
/*     {
      key: "id",
      label: "ID",
    }, */
    {
      key: "nombre",
      label: "NOMBRE",
    },
    {
      key: "tipo",
      label: "TIPO",
    },
    {
      key: "marca",
      label: "MARCA",
    },
    {
      key: "descripcion",
      label: "DESCRIPCION",
    },
    {
      key: "n_serie",
      label: "NUMERO DE SERIE",
    },
    {
      key: "contrato",
      label: "CONTRATO",
    }
  ];


  export const columnsCasos = [
    {
      key: "nombre",
      label: "EQUIPO",
    },
    {
      key: "descripcion",
      label: "CASO",
    },
    {
      key: "estado",
      label: "ESTADO",
    },
    {
      key:"user_id",
      label: "USUARIO",
    },
    {
      key: "created_at",
      label: "FECHA CREACION",
    }
  ];

  export const columnsEventos = [
    {

      key: "nombre",
      label: "NOMBRE",
    },
    {
      key: "descripcion",
      label: "DESCRIPCION",
    },
    {
      key: "estado",
      label: "ESTADO",
    },
    {
      key: "created_at",
      label: "FECHA CREACION",
    },
    {
      key:"user_id",
      label: "USUARIO",
    },
    {
      key:"case_id",
      label:"Nº CASO"
    }
  ];
  export const columnsPanels = [
    {

      key: "nombre_equipo",
      label: "NOMBRE",
    },
    {
      key: "sala_equipo",
      label: "DESCRIPCION",
    },
    {
      key: "eventos",
      label: "ESTADO",
    }
  ];


/* --------Estados-------- */
  export const estados = [
    {
        key:"operativo",
        label:"OPERATIVO",
        value: "OPERATIVO"
    },
    {
      key:"no_operativo",
      label:"NO OPERATIVO",
      value: "NO OPERATIVO"
    }
  ];

  export const estadoCaso = [
    {
        key:"abierto",
        label:"ABIERTO",
        value: "ABIERTO"
    },
    {
      key:"cerrado",
      label:"CERRADO",
      value: "CERRADO"
    }
  ];


  /* -------Funicon para obtener usuarios--------- */

  export const fetchUsers = async () => {
    try {
      const response = await fetch('http://192.168.1.6:3500/api/v1/cmms/users');
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const users = await response.json();
      return users;
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  };
 

