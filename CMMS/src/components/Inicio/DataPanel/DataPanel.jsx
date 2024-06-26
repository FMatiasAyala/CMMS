export const getEquiposYCasosYEventos = async () => {
    try {
      const equiposURL = 'http://192.168.1.6:3500/api/v1/cmms/equipos';
      const casosURL = 'http://192.168.1.6:3500/api/v1/cmms/caso';
      const eventosURL = 'http://192.168.1.6:3500/api/v1/cmms/evento';
      const [equiposResponse, casosResponse, eventosResponse] = await Promise.all([
        fetch(equiposURL),
        fetch(casosURL),
        fetch(eventosURL)
      ]);
  
      if (!equiposResponse.ok || !casosResponse.ok || !eventosResponse.ok) {
        throw new Error('Error en la solicitud a la API');
      }
  
      const equipos = await equiposResponse.json();
      const casos = await casosResponse.json();
      const eventos = await eventosResponse.json();
        
      return { equipos, casos, eventos };
    } catch (error) {
      console.error('Error al obtener equipos y casos:', error);
      return { equipos: [], casos: [], eventos: []};
    }
  };
  
  /* -------------------- */
  
  export const getUltimoCasoPorEquipo = async (equipoId) => {
    const { equipos, casos, eventos } = await getEquiposYCasosYEventos();
  
    const equipo = equipos.find(equipo => equipo.id === equipoId);
  
    if (!equipo) {
      return {
        equipo_id: equipoId,
        nombre_equipo: 'Equipo no encontrado',
        caso: null,
        estado: 'sin casos'
      };
    }
  
    const casosFiltrados = casos.filter(caso => caso.equipo_id === equipoId);
    const casosOrdenados = casosFiltrados.sort((a, b) => b.id - a.id);
    const ultimoCaso = casosOrdenados[0];
    if (casosFiltrados.length === 0) {
      return {
          equipo_id: equipoId,
          nombre_equipo: equipo.nombre,
          sala_equipo: equipo.descripcion,
          caso: null,
          evento: null,
          estado: 'sin casos'
      };
  }


    const eventosFiltrados = eventos.filter(evento => evento.case_id === ultimoCaso.id);
    if (eventosFiltrados.length === 0) {
        return {
            equipo_id: equipoId,
            nombre_equipo: equipo.nombre,
            sala_equipo: equipo.descripcion,
            caso: ultimoCaso,
            fecha: ultimoCaso.created_at,
            evento: null,
            estado: ultimoCaso.estado
        };
    }


    const ultimoEvento = eventosFiltrados.sort((a, b) => b.id - a.id)[0];
  
      return {
        equipo_id: equipoId,
        nombre_equipo: equipo.nombre,
        sala_equipo: equipo.descripcion,
        caso: ultimoCaso,
        fecha: ultimoCaso.created_at,
        estado: ultimoCaso.estado,
        eventos: ultimoEvento.estado,
      }

  };
  export const getEquiposConUltimoCasoYEvento = async () => {
    try {
      const { equipos, casos, eventos } = await getEquiposYCasosYEventos();
      
      const equiposConUltimoCasoYEvento = equipos.map(equipo => {
        const casosFiltrados = casos.filter(caso => caso.equipo_id === equipo.id);
        const casosOrdenados = casosFiltrados.sort((a, b) => b.id - a.id);
        const ultimoCaso = casosOrdenados[0];
        
        if (!ultimoCaso) {
          return {
            equipo_id: equipo.id,
            nombre_equipo: equipo.nombre,
            sala_equipo: equipo.descripcion,
            caso: null,
            evento: null,
            estado: 'sin casos'
          };
        }
  
        const eventosFiltrados = eventos.filter(evento => evento.case_id === ultimoCaso.id);
        const ultimoEvento = eventosFiltrados.sort((a, b) => b.id - a.id)[0];
        
        return {
          equipo_id: equipo.id,
          nombre_equipo: equipo.nombre,
          sala_equipo: equipo.descripcion,
          caso: ultimoCaso,
          fecha: ultimoCaso.created_at,
          estado: ultimoCaso.estado,
          eventos: ultimoEvento ? ultimoEvento.estado : 'sin eventos',
        };
      });
  
      return equiposConUltimoCasoYEvento;
    } catch (error) {
      console.error('Error al obtener equipos, casos y eventos:', error);
      return [];
    }
  };
  
  
  