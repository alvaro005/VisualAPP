import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import AddAttendeeModal from './AddAttendeeModal'; // Modal para agregar asistente
import UpdateAttendeeModal from './UpdateAttendeeModal'; // Modal para actualizar asistente
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa'; // Iconos de FontAwesome

const EventAttendees = () => {
  const { id } = useParams(); // Obtener el ID del evento desde la URL
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState([]); // Estado para la lista de asistentes
  const [event, setEvent] = useState(null); // Estado para almacenar la información del evento
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const [showModal, setShowModal] = useState(false); // Estado para manejar la visibilidad del modal de agregar
  const [showUpdateModal, setShowUpdateModal] = useState(false); // Estado para manejar la visibilidad del modal de actualizar
  const [selectedAttendee, setSelectedAttendee] = useState(null); // Estado para el asistente seleccionado para actualizar

  // Función para obtener la información del evento
  const fetchEvent = async () => {
    try {
      const response = await fetch(`https://appiexamrecu.onrender.com/api/events/${id}`);
      if (!response.ok) {
        throw new Error('Error al obtener el evento');
      }
      const data = await response.json();
      setEvent(data); // Guardar la información del evento en el estado
    } catch (error) {
      setError(error.message); // Manejo de errores
    }
  };

  // Obtener la lista de asistentes al cargar el componente
  const fetchAttendees = async () => {
    try {
      const response = await fetch(`https://appiexamrecu.onrender.com/api/events/${id}/attendees`);
      if (!response.ok) {
        throw new Error('Error al obtener los asistentes');
      }
      const data = await response.json();
      setAttendees(data); // Actualizar la lista de asistentes
    } catch (error) {
      setError(error.message); // Manejo de errores
    } finally {
      setLoading(false); // Dejar de mostrar el cargando
    }
  };

  // Ejecutar las cargas de datos al montar el componente
  useEffect(() => {
    fetchEvent(); // Obtener información del evento
    fetchAttendees(); // Obtener la lista de asistentes
  }, [id]); // Solo volver a ejecutar si cambia el ID del evento

  // Función para actualizar la lista de asistentes después de agregar uno nuevo
  const handleAddAttendee = (newAttendee) => {
    setAttendees((prevAttendees) => [...prevAttendees, newAttendee]);
    setShowModal(false); // Cerrar el modal después de agregar
    fetchAttendees(); // Recargar la lista de asistentes
  };

  // Función para eliminar un asistente con SweetAlert2
  const handleDeleteAttendee = async (attendeeId) => {
    // Mostrar alerta de confirmación con SweetAlert2
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://appiexamrecu.onrender.com/api/attendees/${attendeeId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Error al eliminar el asistente');
        }
        Swal.fire(
          'Eliminado!',
          'El asistente ha sido eliminado.',
          'success'
        );
        fetchAttendees(); // Recargar la lista de asistentes después de eliminar
      } catch (error) {
        setError(error.message); // Manejo de errores
      }
    }
  };

  // Función para actualizar los datos de un asistente con SweetAlert2
  const handleUpdateAttendee = async (updatedAttendee) => {
    // Mostrar alerta de confirmación con SweetAlert2
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡Vas a actualizar los datos del asistente!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://appiexamrecu.onrender.com/api/attendees/${updatedAttendee.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedAttendee),
        });
        if (!response.ok) {
          throw new Error('Error al actualizar el asistente');
        }
        Swal.fire(
          'Actualizado!',
          'Los datos del asistente han sido actualizados.',
          'success'
        );
        fetchAttendees(); // Recargar la lista de asistentes después de la actualización
        setShowUpdateModal(false); // Cerrar el modal de actualización
      } catch (error) {
        setError(error.message); // Manejo de errores
      }
    }
  };

  // Si está cargando, mostrar el spinner
  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando evento y asistentes...</p>
      </div>
    );
  }

  // Si hay un error, mostrar el mensaje de error
  if (error) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
        </div>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Regresar
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Mostrar la información del evento */}
      {event && (
        <div className="mb-4">
          <h3 className="text-primary">{event.title}</h3>
          <p>{event.description}</p>
          <p><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}</p>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-primary">Asistentes del Evento</h3>
        <div className="d-flex flex-column flex-md-row gap-2">
          <button className="btn btn-success w-100 w-md-auto" onClick={() => setShowModal(true)}>
            <FaPlus className="me-2" /> Agregar Asistente
          </button>
          <button className="btn btn-secondary w-100 w-md-auto" onClick={() => navigate(-1)}>
            Regresar
          </button>
        </div>
      </div>

      {/* Tabla de asistentes */}
      {attendees.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-primary">
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Evento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((attendee, index) => (
                <tr key={index}>
                  <td>{attendee.name}</td>
                  <td>{attendee.email}</td>
                  <td>{attendee.Role?.name || 'Sin Rol'}</td>
                  <td>{attendee.Event?.title || 'Sin Evento'}</td>
                  <td>
                    <button className="btn btn-warning me-2" onClick={() => { setSelectedAttendee(attendee); setShowUpdateModal(true); }}>
                      <FaEdit /> Actualizar
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteAttendee(attendee.id)}>
                      <FaTrashAlt /> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info text-center" role="alert">
          No hay asistentes registrados para este evento.
        </div>
      )}

      {/* Modal para agregar asistentes */}
      {showModal && (
        <AddAttendeeModal
          eventId={id} // Pasamos el ID del evento al modal
          onClose={() => setShowModal(false)} // Cerrar el modal
          onAddAttendee={handleAddAttendee} // Callback para actualizar la lista
        />
      )}

      {/* Modal para actualizar asistentes */}
      {showUpdateModal && selectedAttendee && (
        <UpdateAttendeeModal
          attendee={selectedAttendee} // Pasamos los datos del asistente a actualizar
          onClose={() => setShowUpdateModal(false)} // Cerrar el modal
          onUpdateAttendee={handleUpdateAttendee} // Callback para actualizar el asistente
        />
      )}
    </div>
  );
};

export default EventAttendees;
