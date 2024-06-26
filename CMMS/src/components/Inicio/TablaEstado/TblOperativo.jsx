import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { getEquiposConUltimoCasoYEvento } from "../DataPanel/DataPanel";
import { columnsPanels } from "../../../utils/data";

export function TblOperativo({onRowClick}) {
  const [equiposOperativos, setEquiposOperativos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const allEquipos = await getEquiposConUltimoCasoYEvento();
      // Filtrar los equipos no operativos
      const Operativo = allEquipos.filter(allEquipo => allEquipo.eventos === 'OPERATIVO');
      console.log(Operativo);
      setEquiposOperativos(Operativo);
    };

    fetchData();
  }, []);

  return (
    <>
    <Table aria-label="Tabla de equipos operativos" >
      <TableHeader>
        {columnsPanels.map((column) =>
          <TableColumn key={column.key}>{column.label}</TableColumn>
        )}
      </TableHeader>
      <TableBody>
        {Array.isArray(equiposOperativos) && equiposOperativos.map((row, index) => (
          <TableRow key={index} className="cursor-pointer hover:bg-green-200 hover:text-black transition duration-slow ease-in-out"
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
