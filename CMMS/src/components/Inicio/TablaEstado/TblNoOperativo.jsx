import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { getEquiposConUltimoCasoYEvento } from "../DataPanel/DataPanel";
import { columnsPanels } from "../../../utils/data";

export function TblNoOperativo({onRowClick}) {
  const [equiposNoOperativos, setEquiposNoOperativos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const allEquipos = await getEquiposConUltimoCasoYEvento();
      // Filtrar los equipos no operativos
      const noOperativo = allEquipos.filter(allEquipo => allEquipo.eventos === 'NO OPERATIVO');
      console.log(noOperativo);
      setEquiposNoOperativos(noOperativo);
    };

    fetchData();
  }, []);

  return (
    <>
    <Table aria-label="Tabla de equipos no operativos" >
      <TableHeader>
        {columnsPanels.map((column) =>
          <TableColumn key={column.key}>{column.label}</TableColumn>
        )}
      </TableHeader>
      <TableBody >
        {Array.isArray(equiposNoOperativos) && equiposNoOperativos.map((row, index) => (
          <TableRow key={index} className="cursor-pointer hover:bg-red-400 hover:text-black transition duration-slow ease-in-out"
          onClick={() => onRowClick(row.equipo_id)}>
            {columnsPanels.map((column) => (
              <TableCell key={column.key}>
                {row[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
  );
}
