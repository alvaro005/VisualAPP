import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [showEventInfo, setShowEventInfo] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [eventById, setEventById] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [showSearchAttendees, setShowSearchAttendees] = useState(false);
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [showAttendees, setShowAttendees] = useState(false);

  const [eventTypes, setEventTypes] = useState([]);
  const [showEventTypes, setShowEventTypes] = useState(false);
  const [showInfoMenu, setShowInfoMenu] = useState(false); // Estado para mostrar/ocultar menú de eventos y tipos

  const [selectedEvent, setSelectedEvent] = useState(null); // Estado para almacenar el evento seleccionado

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://appiexamrecu.onrender.com/api/events', {
          headers: {
            Accept: 'application/json',
          },
        });
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    if (showEvents) {
      fetchEvents();
    }
  }, [showEvents]);

  // Fetch event types
  const fetchEventTypes = async () => {
    if (eventTypes.length === 0) {
      setLoading(true);
      try {
        const response = await fetch('https://appiexamrecu.onrender.com/api/event-types', {
          headers: { Accept: 'application/json' },
        });
        const data = await response.json();
        setEventTypes(data);
      } catch (error) {
        console.error("Error fetching event types:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch attendees
  const fetchAttendees = async () => {
    if (!showAttendees) {
      setLoading(true);
      try {
        const response = await fetch('https://appiexamrecu.onrender.com/api/attendees', {
          headers: { Accept: 'application/json' },
        });
        const data = await response.json();
        setAttendees(data);
      } catch (error) {
        console.error("Error fetching attendees:", error);
      } finally {
        setLoading(false);
      }
    }
    setShowAttendees(!showAttendees);
  };

  const handleSearchById = async () => {
    setLoading(true);
    setSearchError("");
    setEventById(null);

    try {
      const response = await fetch(`https://appiexamrecu.onrender.com/api/events/${searchId}`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) {
        throw new Error("Event not found");
      }
      const data = await response.json();
      setEventById(data);
    } catch (error) {
      setSearchError("Event not found");
    } finally {
      setLoading(false);
    }
  };

  const toggleShowEvents = () => setShowEvents(!showEvents);
  const toggleShowSearchAttendees = () => setShowSearchAttendees(!showSearchAttendees);
  const toggleShowInfoMenu = () => setShowInfoMenu(!showInfoMenu);

  const handleShowEventInfo = (event) => {
    setSelectedEvent(event); // Set the selected event when the button is clicked
  };

  return (
    <div>
      <div className="d-flex flex-column align-items-center my-5">
        {/* Botones Centrados */}
        <button className="btn btn-info mb-3" onClick={toggleShowInfoMenu}>
          Información y Tipos de Eventos
        </button>
        <button className="btn btn-warning mb-3" onClick={toggleShowSearchAttendees}>
          Buscar Asistentes
        </button>
        <button className="btn btn-primary mb-3" onClick={fetchAttendees}>
          {showAttendees ? "Ocultar Asistentes" : "Obtener Asistentes"}
        </button>
      </div>

      <div className="container my-5">
        {/* Menú Información y Tipos de Eventos */}
        {showInfoMenu && (
          <div>
            <div className="text-center mb-4">
              <button className="btn btn-secondary mb-3" onClick={toggleShowEvents}>
                {showEvents ? "Ocultar Información de Eventos" : "Mostrar Información de Eventos"}
              </button>
              <button className="btn btn-success mb-3" onClick={() => {
                fetchEventTypes();
                setShowEventTypes(!showEventTypes);
              }}>
                {showEventTypes ? "Ocultar Tipos de Eventos" : "Mostrar Tipos de Eventos"}
              </button>
            </div>
          </div>
        )}

        {/* Información de eventos */}
        {showEvents && (
          <div className="row">
            {events.map((event) => (
              <div key={event.id} className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{event.title}</h5>
                    <p className="card-text">{event.description.slice(0, 100)}...</p>
                    <p className="card-text">
                      <strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}
                    </p>
                    <button className="btn btn-primary" onClick={() => handleShowEventInfo(event)}>
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detalles del evento seleccionado */}
        {selectedEvent && (
          <div className="mt-4">
            <h3>Detalles del Evento</h3>
            <div>
              <p><strong>Título:</strong> {selectedEvent.title}</p>
              <p><strong>Descripción:</strong> {selectedEvent.description}</p>
              <p><strong>Fecha:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
              <p><strong>Ubicación:</strong> {selectedEvent.location}</p>
              <p><strong>Tipo de Evento:</strong> {selectedEvent.type}</p>
            </div>
          </div>
        )}

        {/* Tipos de eventos */}
        {showEventTypes && (
          <div className="text-center mb-4">
            <h3 className="mb-4">Tipos de Eventos</h3>
            <ul className="list-group">
              {eventTypes.map((type) => (
                <li key={type.id} className="list-group-item">
                  <strong>{type.name}:</strong> {type.description}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Buscar asistentes */}
        {showSearchAttendees && (
          <div className="text-center mb-4">
            <div className="d-inline-block">
              <input
                type="text"
                className="form-control d-inline-block w-50"
                placeholder="Buscar por email"
                value={attendeeEmail}
                onChange={(e) => setAttendeeEmail(e.target.value)}
              />
              <button className="btn btn-secondary ml-2" onClick={() => handleSearchById()}>
                Buscar
              </button>
            </div>
          </div>
        )}

        {/* Mostrar asistentes */}
        {showAttendees && attendees.length > 0 && (
          <div className="text-center mb-4">
            <h3 className="mb-4">Asistentes</h3>
            <ul className="list-group">
              {attendees.map((attendee) => (
                <li key={attendee.id} className="list-group-item">
                  <strong>{attendee.name}:</strong> {attendee.email} <br />
                  <strong>Evento:</strong> {attendee.Event.title} (
                  {new Date(attendee.Event.date).toLocaleDateString()}) <br />
                  <strong>Rol:</strong> {attendee.Role.name} -{" "}
                  {attendee.Role.description}
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
