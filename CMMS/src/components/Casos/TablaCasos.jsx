import { useEffect, useState } from "react";
import { Table, TableColumn, TableHeader, TableRow, TableCell, TableBody, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Select, SelectItem } from "@nextui-org/react";
import { MenuCaso } from "../../hooks/Menu";
import { columnsCasos, fetchUsers, estadoCaso } from "../../utils/data";
import { useNavigate, useParams } from "react-router-dom";
import { formatearFecha } from "../../utils/fetchData";



export function TablaCasos() {
    const [caso, setCaso] = useState([]);
    const [updateFlag, setUpdateFlag] = useState(false);
    const [usuario, setUsuario] = useState([]);
    const [selectedCaseId, setSelectedCaseId] = useState(null);
    const navigate = useNavigate();
    const { equipoId } = useParams();





    const handleCaseClick = (caseId) => {
        setSelectedCaseId(caseId);
        navigate(`${caseId}`);

    };

    useEffect(() => {
        const getUsers = async () => {
            const fetchedUsers = await fetchUsers();
            setUsuario(fetchedUsers);
        };

        getUsers();
    }, []);



    useEffect(() => {
        const fetchEquipo = async () => {
            try {
                const response = await fetch('http://192.168.1.6:3500/api/v1/cmms/caso');
                if (!response.ok) {
                    throw new Error('Error al obtener los datos de equipos');
                }
                const data = await response.json();
                setCaso(data);
            } catch (error) {
                console.error('Error en la solicitud de datos de equipos:', error);
            }
        };

        fetchEquipo();
    }, [updateFlag]);

    const handleDelete = async (id) => {
        try {
            // Realizar una solicitud DELETE para eliminar el elemento con el ID especificado
            const response = await fetch(`http://192.168.1.6:3500/api/v1/cmms/caso/${id}`, {
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

    const filterEventosByCaseId = (casos, equipoId) => {
        const filteredEventos = casos.filter(caso => caso.equipo_id === Number(equipoId));
        return filteredEventos;
    };

    const filteredEventos = filterEventosByCaseId(caso, equipoId);

    const handleEventCreated = () => {
        setUpdateFlag(prevFlag => prevFlag + 1);
    }

    const handleCerrarCaso = async (id) => {
        setCaso(caso.map(caso =>
            caso.id === id ? { ...caso, estado: 'CERRADO' } : caso
        ));
        // Luego, realiza la solicitud PUT al servidor
        try {
            const response = await fetch(`http://192.168.1.6:3500/api/v1/cmms/caso/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado: 'CERRADO' }),
            });

            if (!response.ok) {
                throw new Error('Error en la actualización del caso');
            }

            const updatedCaso = await response.json();
        } catch (error) {
            console.error('Error al actualizar el caso:', error);
        }
    };

    return (
        <>
            <div className="grid col-auto gap-2">
                <div className="flex items-center">
                    <ModalCreate onEventCreated={handleEventCreated} />
                    <Input isDisabled type variant="underlined" label="Search" className="flex border-none w-48 ml-4" />

                </div>
                <Table aria-label="Tabla de equipos">
                    <TableHeader>
                        {columnsCasos.map((column) =>
                            <TableColumn key={column.key}>{column.label}</TableColumn>
                        )}
                        <TableColumn key="options">ACCIONES</TableColumn> {/* Nueva columna para las opciones */}
                    </TableHeader>
                    <TableBody >
                        {filteredEventos.map((row, index) => (
                            <TableRow key={index} className={`cursor-pointer hover:bg-blue-400 transition duration-slow ease-in-out ${row.estado === 'cerrado' ? 'cerrado' : 'abierto'}`} >
                                {columnsCasos.map((column) =>
                                    <TableCell key={column.key}
                                        className={column.key === 'estado' ? getClaseEstadoCaso(row[column.key]) : ""}

                                        onClick={() => handleCaseClick(row.id)} >                                        {column.key === 'user_id' ? getUserById(row[column.key], usuario) :
                                            column.key === 'created_at' ? formatearFecha(row[column.key]) :
                                                row[column.key]}</TableCell>
                                )}
                                <TableCell key="options">
                                    <MenuCaso onDelete={() => handleDelete(row.id)}
                                        onEdit={() => handleCerrarCaso(row.id)} funcion1={"Eventos"} funcion2={"Cerrar caso"} funcion3={"Eliminar caso"}>
                                    </MenuCaso>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}


function Formulario({ onClose, onEventCreated }) {
    const { equipoId } = useParams();
    const equipo_id = parseInt(equipoId, 10);
    const [nombreEquipo, setNombreEquipo] = useState([]);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        estado: '',
        equipo_id: '',
        user_id: ''
    });
    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await fetch('http://192.168.1.6:3500/api/v1/cmms/users');
                if (!response.ok) {
                    throw new Error('Error al obtener los datos de equipos');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error en la solicitud de datos de equipos:', error);
            }
        };

        fetchUsuario();
    }, []);



    useEffect(() => {
        const fetchNombreEquipo = async () => {
            try {
                const response = await fetch(`http://192.168.1.6:3500/api/v1/cmms/equipos/${equipo_id}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los datos de equipos');
                }
                const data = await response.json();
                setNombreEquipo(data);
            } catch (error) {
                console.error('Error en la solicitud de datos de equipos:', error);
            }
        };

        fetchNombreEquipo();
    }, []);

    useEffect(() => {
        if (nombreEquipo && equipo_id) {
            setFormData({
                nombre: nombreEquipo.nombre,
                descripcion: '',
                estado: '',
                equipo_id: equipo_id,
                user_id: ''
            });
        }
    }, [nombreEquipo, equipo_id]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value;
        // Actualizar el estado del formulario con el valor actualizado
        setFormData({ ...formData, [name]: updatedValue });
    };
    // Función para manejar el cambio en el select del formulario
    const handleEstadoChange = (e) => {
        setFormData({
            ...formData,
            estado: e.target.value,
        });
    };

    const handleUserChange = (e) => {
        const userId = parseInt(e.target.value, 10);
        setFormData({
            ...formData,
            user_id: userId
        });
    };


    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetch('http://192.168.1.6:3500/api/v1/cmms/caso/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            onEventCreated();
            onClose();

        } catch (error) {
            console.error('Error al agregar el caso:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 flex-col">
            <Input isRequired type="descripcion" name="descripcion" value={formData.descripcion} placeholder="Descripcion" onChange={handleChange} variant="underlined" />
            <Select
                isRequired
                className="max-w-xs"
                onChange={handleUserChange}
                name="user_id"
                value={formData.user_id}
                aria-label="user_id"
            >
                {users.map((user) => (
                    <SelectItem key={user.id} value={user.username}>
                        {user.username}
                    </SelectItem>
                ))}
            </Select>
            <Select
                isRequired
                className="max-w-xs"
                onChange={handleEstadoChange}
                aria-label="estado"
            >
                {estadoCaso.map((estado) => (
                    <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                    </SelectItem>
                ))}
            </Select>
            <Button type="submit">Agregar caso</Button>
        </form>
    );
}


export function ModalCreate({ onEventCreated }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <Button onPress={onOpen}>Abrir caso</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Cargar caso</ModalHeader>
                            <ModalBody>
                                <Formulario onClose={onClose} onEventCreated={onEventCreated} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
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


function getUserById(userId, usuario) {
    const user = usuario.find(user => user.id === userId);
    return user ? user.username : 'Usuario desconocido';
}

function getClaseEstadoCaso(estado) {
    return estado === 'CERRADO' ? 'text-red-400' : 'text-green-400';
}

