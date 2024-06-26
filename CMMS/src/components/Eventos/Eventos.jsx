import { Table, TableColumn, TableHeader, TableRow, TableCell, TableBody, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Select, SelectItem } from "@nextui-org/react";
import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { columnsEventos, estados, fetchUsers } from "../../utils/data";
import { formatearFecha } from "../../utils/fetchData";


export function TablaEventos() {
    const [eventos, setEvento] = useState([]);
    const [updateFlag, setUpdateFlag] = useState();
    const [usuario, setUsuario] = useState([]);
    const { caseId } = useParams();



    useEffect(() => {
        const getUsers = async () => {
            const fetchedUsers = await fetchUsers();
            setUsuario(fetchedUsers);
        };

        getUsers();
    }, []);



    useEffect(() => {
        const fetchEvento = async () => {
            try {
                const response = await fetch('http://192.168.1.6:3500/api/v1/cmms/evento');
                if (!response.ok) {
                    throw new Error('Error al obtener los datos de equipos');
                }
                const data = await response.json();
                setEvento(data);
            } catch (error) {
                console.error('Error en la solicitud de datos de equipos:', error);
            }
        };

        fetchEvento();
    }, [updateFlag]);


    const filterEventosByCaseId = (eventos, caseId) => {
        const filteredEventos = eventos.filter(evento => evento.case_id === Number(caseId));
        return filteredEventos;
    };

    const filteredEventos = filterEventosByCaseId(eventos, caseId);
    const handleEventCreated = () => {
        setUpdateFlag(prevFlag => prevFlag + 1); // Incrementa el valor de updateFlag
    };

    return (
        <>
            <div className="grid col-auto gap-2">
                <div className="flex items-center">
                    <ModalCreate onEventCreated={handleEventCreated} />
                </div>
                <Table aria-label="Tabla de equipos">
                    <TableHeader>
                        {columnsEventos.map((column) =>
                            <TableColumn key={column.key}>{column.label}</TableColumn>
                        )}
                    </TableHeader>
                    <TableBody>
                        {filteredEventos.map((row, index) => (
                            <TableRow key={index}>
                                {columnsEventos.map((column) => (
                                    <TableCell key={column.key} className={column.key === "estado" ? getClaseEstadoEvento(row[column.key]) : ""}>
                                        {column.key === 'user_id' ? getUserById(row[column.key], usuario) :
                                            column.key === 'created_at' ? formatearFecha(row[column.key]) :
                                                row[column.key]}

                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};



function Formulario({ onClose, onEventCreated }) {
    const { caseId } = useParams();
    const case_id = parseInt(caseId, 10)
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        estado: '',
        case_id: case_id,
        user_id: ''
    });
    const [users, setUsers] = useState([]);
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



    // Función para manejar los cambios en los inputs del formulario
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
            await fetch('http://192.168.1.6:3500/api/v1/cmms/evento/', {
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
            <Input isRequired type="nombre" name="nombre" value={formData.nombre} placeholder="Nombre" onChange={handleChange} variant="underlined" />
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
                {estados.map((estado) => (
                    <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                    </SelectItem>
                ))}
            </Select>
            <Button type="submit">Agregar evento</Button>
        </form>
    );
}


function ModalCreate({ onEventCreated }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <Button onPress={onOpen}>Nuevo evento</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Cargar evento</ModalHeader>
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

function getClaseEstadoEvento(estado) {
    return estado === 'NO OPERATIVO' ? 'text-red-400' : 'text-green-400';
}