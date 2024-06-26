export const formatearFecha = (fecha) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(fecha).toLocaleDateString(undefined, options);
  };