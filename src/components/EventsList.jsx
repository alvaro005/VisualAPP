import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const EventsList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [eventTypes, setEventTypes] = useState([]);
  const [showEventTypes, setShowEventTypes] = useState(false);
  const [showEventMenu, setShowEventMenu] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [attendeesSearch, setAttendeesSearch] = useState([]);
  // Estado para almacenar los datos de la API
  const [assistants, setAssistants] = useState([]);
  const [showAssistants, setShowAssistants] = useState(false);

  const [roles, setRoles] = useState([]);

  const [showEventTypesModal, setShowEventTypesModal] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [newEvent, setNewEvent] = useState({
    id: 0,
    title: '',
    description: '',
    date: '',
    eventTypeId: 0,
  });
  const [searchId, setSearchId] = useState('');
  const [deleteEventId, setDeleteEventId] = useState(''); // ID para eliminar evento
  const [newAttendee, setNewAttendee] = useState({
    name: '',
    email: '',
    roleId: 0,
    eventId: 0,
  });
  const [showAddAttendee, setShowAddAttendee] = useState(false);




  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://appiexamrecu.onrender.com/api/events', {
          headers: { Accept: 'application/json' },
        });
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    if (showEvents) {
      fetchEvents();
    }
  }, [showEvents]);

  // Función para hacer la petición a la API
  const fetchAssistants = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://appiexamrecu.onrender.com/api/roles', {
        headers: {
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      setAssistants(data);
    } catch (error) {
      console.error('Error fetching assistants:', error);
    } finally {
      setLoading(false);
    }
  };



  // Fetch event types
  useEffect(() => {
    const fetchEventTypes = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://appiexamrecu.onrender.com/api/event-types', {
          headers: { Accept: 'application/json' },
        });
        const data = await response.json();
        setEventTypes(data);
      } catch (error) {
        console.error('Error fetching event types:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventTypes();
  }, []);


  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://appiexamrecu.onrender.com/api/roles', {
          headers: { Accept: 'application/json' },
        });
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Fetch attendees
  useEffect(() => {
    const fetchAttendees = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://appiexamrecu.onrender.com/api/attendees', {
          headers: { Accept: 'application/json' },
        });
        const data = await response.json();
        setAttendees(data);
        setAttendeesSearch(data); // Inicializar con todos los asistentes
      } catch (error) {
        console.error('Error fetching attendees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, []);

  // Filtrar asistentes por ID
  const handleSearchAttendees = () => {
    if (searchId) {
      const filtered = attendees.filter((attendee) => attendee.id === parseInt(searchId));
      setAttendeesSearch(filtered);
    } else {
      setAttendeesSearch(attendees);
    }
  };

  const handleUpdateEvent = (eventId) => {
    navigate(`/update-event/${eventId}`);
  };

  // Eliminar un evento por ID
  const handleDeleteEvent = async () => {
    if (!deleteEventId) {
      alert('Por favor, ingrese un ID de evento válido.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://appiexamrecu.onrender.com/api/events/${deleteEventId}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el evento');
      }

      setEvents(events.filter((event) => event.id !== parseInt(deleteEventId)));
      alert('Evento eliminado exitosamente.');
      setDeleteEventId('');
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission to create a new event
  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.eventTypeId) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://appiexamrecu.onrender.com/api/events', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error('Error al crear el evento');
      }

      const createdEvent = await response.json();
      setEvents((prevEvents) => [...prevEvents, createdEvent]);
      setNewEvent({ id: 0, title: '', description: '', date: '', eventTypeId: 0 });
      setShowEventMenu(false);
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission to create a new attendee
  const handleCreateAttendee = async () => {
    if (!newAttendee.name || !newAttendee.email || !newAttendee.roleId || !newAttendee.eventId) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://appiexamrecu.onrender.com/api/attendees', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAttendee),
      });

      if (!response.ok) {
        throw new Error('Error al crear el asistente');
      }

      const createdAttendee = await response.json();
      setAttendees((prevAttendees) => [...prevAttendees, createdAttendee]);
      setShowAddAttendee(false);
    } catch (error) {
      console.error('Error creating attendee:', error);
    } finally {
      setLoading(false);
    }
  };




  // Función que maneja el clic del botón
  const handleButtonClick = () => {
    if (!showAssistants) {
      fetchAssistants();  // Cargar los asistentes solo cuando se haga clic
    }
    setShowAssistants(!showAssistants);  // Alternar la visibilidad
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div>
      <div className="d-flex flex-column justify-content-center align-items-center my-5">
        <button className="btn btn-info mb-3 w-50 shadow-sm rounded-pill"
          onClick={() => setShowEventMenu(!showEventMenu)}
          style={{
            backgroundColor: '#00b5de',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          {showEventMenu ? 'Ocultar Menú de Eventos' : 'Mostrar Menú de Eventos'}
        </button>
      </div>

      <div className="container my-5">
        {showEventMenu && (
          <div>
            <div className="text-center mb-4">
              <button
                className="btn btn-secondary mb-3 w-50 shadow-sm rounded-pill"
                onClick={() => setShowEvents(!showEvents)}
                style={{
                  backgroundColor: '#00b5de',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                {showEvents ? 'Ocultar Eventos Existentes' : 'Eventos Existentes'}
              </button>
              <div className="text-center mb-4">

                <button
                  className="btn btn-secondary mb-3 w-50 shadow-sm rounded-pill"
                  onClick={() => setShowEventTypes(!showEventTypes)}
                  style={{
                    backgroundColor: '#00b5de',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: 'pointer',
                  }}
                >
                  {showEventTypes ? 'Ocultar Tipos de Evento' : 'Tipos de Eventos'}

                </button>
              </div>

              {showEventTypes && (
                <div className="mb-4">
                  <h4 style={{ color: '#0ab0f3', fontWeight: 'bold' }}>Tipos de Eventos</h4>
                  <ul className="list-group">
                    {eventTypes.map((type) => (
                      <li key={type.id} className="list-group-item">
                        <strong>ID:</strong> {type.id} <br />
                        <strong>Nombre:</strong> {type.name} <br />
                        <strong>Descripción:</strong> {type.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <button
                  className="btn btn-secondary mb-3 w-50 shadow-sm rounded-pill"

                  onClick={() => handleButtonClick(!handleButtonClick)}
                  style={{
                    backgroundColor: '#00b5de',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: 'pointer',
                  }}
                >
                  {showAssistants ? 'Ocultar Roles de Asistente' : 'Roles de Asistente'}
                </button>

                {loading && <p>Cargando...</p>}

                {showAssistants && !loading && assistants.length > 0 && (
                  <div>
                    <h4 style={{ color: '#0ab0f3', fontWeight: 'bold' }}>Roles Existentes</h4>
                    <ul className="list-group">
                      {assistants.map((assistant) => (
                        <li key={assistant.id} className="list-group-item">
                          <strong>Nombre:</strong> {assistant.name} <br />
                          <strong>Descripción:</strong> {assistant.description} <br />
                          <strong>ID:</strong> {assistant.id}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <h4 style={{ color: '#00b5de', fontWeight: 'bold' }}>Creación de Eventos</h4>
            <div className="form-group">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Título"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Descripción"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />




              <input
                type="datetime-local"
                className="form-control mb-3"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />

              <select
                className="form-control mb-3"
                value={newEvent.eventTypeId}
                onChange={(e) => setNewEvent({ ...newEvent, eventTypeId: parseInt(e.target.value) })}
              >


                <option value="">Seleccione el tipo de evento</option>
                {eventTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <button className="btn btn-primary"
                onClick={handleCreateEvent}>
                Crear
              </button>

            </div>
            <h4 style={{ color: '#00b5de', fontWeight: 'bold' }}>Eliminar Evento</h4>
            <div className="form-group">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="ID de Evento a Eliminar"
                value={deleteEventId}
                onChange={(e) => setDeleteEventId(e.target.value)}
              />
              <button
                className="btn btn-danger"
                onClick={() => {
                  const confirmDelete = window.confirm(
                    "¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer."
                  );
                  if (confirmDelete) {
                    handleDeleteEvent(); // Llamar la función de eliminación solo si se confirma
                  }
                }}
              >
                Eliminar


              </button>
            </div>
          </div>
        )}

        {showEvents && (
          <div className="row">
            {events.map((event) => {
              const eventType = eventTypes.find((type) => type.id === event.eventTypeId);
              return (
                <div key={event.id} className="col-md-4 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{event.title}</h5>
                      <p className="card-text">{event.description}</p>
                      <p className="card-text">

                        {/*informacion de los eventos a mostrar*/}
                        <strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="card-text">
                        <strong>Tipo de Evento:</strong> {eventType ? `${eventType.name} - ${eventType.description}` : 'Sin Tipo'}
                      </p>
                      <p className="card-text">
                        <strong>ID de Creación:</strong> {event.id} {/* ID del evento */}
                      </p>
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-warning w-100 w-md-auto"
                          onClick={() => handleUpdateEvent(event.id)}

                        >
                          Actualizar Evento
                        </button>
                        <button
                          className="btn btn-info w-100 w-md-auto"

                          onClick={() => navigate(`/events/${event.id}/attendees`)}
                        >
                          Ver Asistentes
                        </button>
                        <button
                          className="btn btn-success w-100 w-md-auto"
                          onClick={() => {
                            setNewAttendee({ ...newAttendee, eventId: event.id });
                            setShowAddAttendee(true);
                          }}
                        >
                          Agregar Asistente
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}


        {showAddAttendee && (
          
          <div>
            {/* TEXTO TITULO AGREGAR ASISTE*/}
            <h4 style={{ color: '#00b5de', fontWeight: 'bold', fontSize: '1.6rem' }}>Agregar Asistente</h4>
            <div className="form-group">
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Nombre"
                value={newAttendee.name}
                onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
              />
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Correo"
                value={newAttendee.email}
                onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
              />
              <select
                className="form-control mb-3"
                value={newAttendee.roleId}
                onChange={(e) => setNewAttendee({ ...newAttendee, roleId: parseInt(e.target.value) })}
              >
                <option value="">Seleccione el rol</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              <button className="btn btn-primary" onClick={handleCreateAttendee}>
                Agregar Asistente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;
