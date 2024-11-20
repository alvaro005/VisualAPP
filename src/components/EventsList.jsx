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
  const [showAttendees, setShowAttendees] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [attendeesSearch, setAttendeesSearch] = useState([]);
  const [newEvent, setNewEvent] = useState({
    id: 0,
    title: '',
    description: '',
    date: '',
    eventTypeId: 0,
  });
  const [searchId, setSearchId] = useState('');
  const [deleteEventId, setDeleteEventId] = useState(''); // ID para eliminar evento

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

    if (showAttendees) {
      fetchAttendees();
    }
  }, [showAttendees]);

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

  return (
    <div>
      <div className="d-flex flex-column justify-content-center align-items-center my-5">
        <button className="btn btn-info mb-3 w-50 shadow-sm rounded-pill" onClick={() => setShowEventMenu(!showEventMenu)}>
          {showEventMenu ? 'Ocultar Menú de Eventos' : 'Mostrar Menú de Eventos'}
        </button>
        <button className="btn btn-warning mb-3 w-50 shadow-sm rounded-pill" onClick={() => setShowAttendees(!showAttendees)}>
          {showAttendees ? 'Ocultar Lista de Asistentes' : 'Mostrar Lista de Asistentes'}
        </button>
      </div>

      <div className="container my-5">
        {showEventMenu && (
          <div>
            <div className="text-center mb-4">
              <button
                className="btn btn-secondary mb-3 w-50 shadow-sm rounded-pill"
                onClick={() => setShowEvents(!showEvents)}
              >
                {showEvents ? 'Ocultar Información de Eventos' : 'Mostrar Información de Eventos'}
              </button>
              <button
                className="btn btn-success mb-3 w-50 shadow-sm rounded-pill"
                onClick={() => setShowEventTypes(!showEventTypes)}
              >
                {showEventTypes ? 'Ocultar Tipos de Eventos' : 'Mostrar Tipos de Eventos'}
              </button>
            </div>
            <h4>Crear Evento</h4>
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
                type="date"
                className="form-control mb-3"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              />
              <select
                className="form-control mb-3"
                value={newEvent.eventTypeId}
                onChange={(e) => setNewEvent({ ...newEvent, eventTypeId: parseInt(e.target.value) })}
              >
                <option value={0}>Seleccione un tipo de evento</option>
                {eventTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <button className="btn btn-primary" onClick={handleCreateEvent}>
                Crear Evento
              </button>
              <div className="mt-3">
                <h4>Eliminar Evento</h4>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Ingrese ID del Evento a Eliminar"
                  value={deleteEventId}
                  onChange={(e) => setDeleteEventId(e.target.value)}
                />
                <button className="btn btn-danger" onClick={handleDeleteEvent}>
                  Eliminar Evento
                </button>
              </div>
            </div>
          </div>
        )}

        {showEvents && (
          <div className="row">
            {events.map((event) => (
              <div key={event.id} className="col-md-4 mb-4 mt-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{event.title}</h5>
                    <p className="card-text">{event.description.slice(0, 100)}...</p>
                    <p className="card-text">
                      <strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="card-text">
                      <strong>ID:</strong> {event.id}
                    </p>
                    <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
                      <button
                        className="btn btn-primary w-100 w-md-auto"
                        onClick={() => navigate(`/update-event/${event.id}`)}
                      >
                        Actualizar Evento
                      </button>
                      <button
                        className="btn btn-info w-100 w-md-auto"
                        onClick={() => navigate(`/events/${event.id}/attendees`)}
                      >
                        Ver Asistentes
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showEventTypes && (
          <div className="row">
            {eventTypes.map((type) => (
              <div key={type.id} className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{type.name}</h5>
                    <p className="card-text">
                      <strong>ID:</strong> {type.id}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAttendees && (
          <div>
            <h3 className="mb-4 text-center">Lista de Asistentes</h3>
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Buscar Asistente por ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button className="btn btn-warning mb-3" onClick={handleSearchAttendees}>
              Buscar Asistente
            </button>
            <ul className="list-group">
              {attendeesSearch.map((attendee) => (
                <li key={attendee.id} className="list-group-item">
                  <strong>{attendee.name}</strong> - ID: {attendee.id}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;
