import { useEffect, useState } from "react";
import { Table, TableColumn, TableHeader, TableRow, TableCell, TableBody, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { MenuOpciones } from "../../hooks/Menu";
import { columnsEquipo } from "../../utils/data";
import { useNavigate} from "react-router-dom";




export function TablaEquipo() {
  const [equipo, setEquipo] = useState([]);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();


  const handleCaseClick = (caseId)=> {
      setSelectedCaseId(caseId);
      navigate(`/${caseId}`);
  };

  useEffect(() => {
    const fetchEquipo = async () => {
      try {
        const response = await fetch('http://192.168.1.6:3500/api/v1/cmms/equipos');
        if (!response.ok) {
          throw new Error('Error al obtener los datos de equipos');
        }
        const data = await response.json();
        setEquipo(data);
      } catch (error) {
        console.error('Error en la solicitud de datos de equipos:', error);
      }
    };
    

    fetchEquipo();
  }, [updateFlag]);

  const handleEventCreated = async (formData) => {
    try {
      // Realizar una solicitud POST para agregar un nuevo equipo
      const response = await fetch('http://192.168.1.6:3500/api/v1/cmms/equipos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al agregar el equipo');
      }

      // Obtener el equipo recién creado
      const newEquipo = await response.json();

      // Actualizar la lista de equipos con el nuevo equipo
      setEquipo(prevEquipo => [...prevEquipo, newEquipo]);

      console.log('Equipo agregado con éxito');
    } catch (error) {
      console.error('Error al agregar el equipo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Realizar una solicitud DELETE para eliminar el elemento con el ID especificado
      const response = await fetch(`http://192.168.1.6:3500/api/v1/cmms/equipos/${id}`, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el equipo');
      }
      setUpdateFlag(!updateFlag);
      // Actualizar la interfaz de usuario u realizar otras acciones necesarias
      console.log('Equipo eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar el equipo:', error);
    }
  };

  return (
    <>
      <div className="grid col-auto gap-2">
        <div className="flex items-center">
          <ModalCreate onEventCreate={handleEventCreated}/>
          <Input type variant="underlined" label="Search" value={search} className="flex border-none w-48 ml-4" onChange={(e)=> setSearch(e.target.value)}/>

        </div>
        <Table aria-label="Tabla de equipos">
          <TableHeader>
            {columnsEquipo.map((column) =>
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
            <TableColumn key="options">ACCIONES</TableColumn> {/* Nueva columna para las opciones */}
          </TableHeader>
          <TableBody>
          {equipo
            .filter((row) => row.nombre.toLowerCase().includes(search.toLowerCase()))
            .map((row, index) => (
              <TableRow key={index} className="cursor-pointer hover:bg-blue-400 transition duration-slow ease-in-out">
                {columnsEquipo.map((column) => (
                  <TableCell key={column.key} onClick={() => handleCaseClick(row.id)}>
                    {row[column.key]}
                  </TableCell>
                ))}
                <TableCell key="options">
                  <MenuOpciones onDelete={() => handleDelete(row.id)} funcion1={"Edit"} funcion2={"Delete"} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        </Table>
      </div>
    </>
  );
}



function FormularioEquipo ({ onClose, onEventCreate}) {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    marca: '',
    descripcion: '',
    n_serie: '',
    contrato: ''
  });

  // Función para manejar los cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    // Actualizar el estado del formulario con el valor actualizado
    setFormData({ ...formData, [name]: updatedValue });
  };


  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://192.168.1.6:3500/api/v1/cmms/equipos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const newEquipo = await response.json();
      onEventCreate(newEquipo);
      onClose();

    } catch (error) {
      console.error('Error al agregar el equipo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-col">
      <Input isRequired type="nombre" name="nombre" value={formData.nombre} placeholder="Nombre" onChange={handleChange} variant="underlined" />
      <Input isRequired type="tipo" name="tipo" value={formData.tipo} placeholder="Tipo" onChange={handleChange} variant="underlined" />
      <Input isRequired type="marca" name="marca" value={formData.marca} placeholder="Marca" onChange={handleChange} variant="underlined" />
      <Input isRequired type="descripcion" name="descripcion" value={formData.descripcion} placeholder="Descripcion" onChange={handleChange} variant="underlined" />
      <Input isRequired type="n_serie" name="n_serie" value={formData.n_serie} placeholder="Nº Serie" onChange={handleChange} variant="underlined" />
      <Input type="contrato" name="contrato" value={formData.contrato} placeholder="Contrato" onChange={handleChange} variant="underlined" />
      <Button type="submit">Agregar Equipo</Button>
    </form>
  );
}




function ModalCreate({onEventCreate}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen}>Nuevo equipo</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Cargar equipo</ModalHeader>
              <ModalBody>
                <FormularioEquipo onClose={onClose} onEventCreate={onEventCreate}/>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose} onClick={onEventCreate}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}


