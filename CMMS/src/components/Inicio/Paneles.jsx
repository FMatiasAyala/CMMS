import React, { useState, useEffect } from 'react';
import { getEquiposYCasosYEventos, getUltimoCasoPorEquipo } from './DataPanel/DataPanel';
import { Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { Panel } from './DataPanel/Panel';
import { formatearFecha } from '../../utils/fetchData';
import { TblNoOperativo } from './TablaEstado/TblNoOperativo';
import { TblOperativo } from './TablaEstado/TblOperativo';


export function Paneles() {
  const [ultimoCaso, setUltimoCaso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [equipos, setEquipos] = useState([]);
  const [equipoId, setEquipoId] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const navigate = useNavigate();

  const handleCaseClick = (caseId) => {
    setSelectedCaseId(caseId);
    navigate(`/${caseId}`);
  };

  const handleEquipoSelection = async (equipoId) => {
    setEquipoId(equipoId);
    console.log(equipoId);
  };

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const { equipos } = await getEquiposYCasosYEventos();
        setEquipos(equipos);
      } catch (error) {
        console.error('Error al obtener equipos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipos();
  }, []);

  useEffect(() => {
    const fetchUltimoCaso = async () => {
      if (equipoId !== null) {
        setLoading(true);
        try {
          const resultado = await getUltimoCasoPorEquipo(equipoId);
          setUltimoCaso(resultado);
        } catch (error) {
          console.error('Error al obtener el último caso:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUltimoCaso();
  }, [equipoId]);

  return (
    <div className='grid grid-cols-2 grid-flow-row gap-3'>
      <div className='grid col-start-1 gap-4 w-full max-w-4xl p-6'>
        <TblOperativo onRowClick={handleEquipoSelection} />
        <TblNoOperativo onRowClick={handleEquipoSelection} />
      </div>
      <div className={`transition-all duration-300 ${ultimoCaso ? 'max-h-full opacity-100 col-start-2 items-center w-full max-w-4xl p-6 ' : 'max-h-0 opacity-0 col-start-2 items-center w-full max-w-4xl p-6'}`}>
        <Panel >
          {ultimoCaso && (
            <div>
              <h1 className="text-2xl font-bold text-white-800 flex flex-col justify-center items-center" >{ultimoCaso.nombre_equipo}</h1>
              {ultimoCaso.caso ? (
                <>
                  <div className='flex flex-col justify-center items-center gap-2'>
                    <p className="text-lg text-white-700">Sala: {ultimoCaso.sala_equipo}</p>
                    <p className="text-lg text-white-700">Último caso ID: {ultimoCaso.caso.id}</p>
                    <p className="text-lg text-white-700">Fecha: {formatearFecha(ultimoCaso.fecha)}</p>
                    <p className="text-lg text-white-700">Estado del Caso: {ultimoCaso.estado}</p>
                    <p className={`text-lg font-semibold ${ultimoCaso.eventos === "OPERATIVO" ? 'text-green-400' : 'text-red-400'}`}>{ultimoCaso.eventos}</p>
                    <Button  color={`${ultimoCaso.eventos === "OPERATIVO" ? 'success' : 'warning'}`} variant="ghost" onClick={() => handleCaseClick(equipoId)} >
                      INSPECCIONAR
                    </Button>

                  </div>
                </>

              ) : (
                <p className="text-lg text-white-700" >Sin casos</p>
              )}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
};


