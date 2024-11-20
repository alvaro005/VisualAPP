import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateEvent = () => {
  const { id } = useParams(); // Obtener ID del evento de los parámetros de la ruta
  const navigate = useNavigate(); // Navegar de regreso después de actualizar
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    eventTypeId: 0,
  });
  const [eventTypes, setEventTypes] = useState([]); // Para almacenar los tipos de evento

  // Obtener datos del evento y tipos de evento al cargar
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`https://appiexamrecu.onrender.com/api/events/${id}`);
        const data = await response.json();
        
        // Transformar la fecha al formato YYYY-MM-DD si existe
        const formattedDate = data.date ? data.date.split('T')[0] : '';
        setEventData({ ...data, date: formattedDate }); // Cargar los datos del evento con la fecha formateada
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    const fetchEventTypes = async () => {
      try {
        const response = await fetch(`https://appiexamrecu.onrender.com/api/event-types`);
        const data = await response.json();
        setEventTypes(data); // Cargar los tipos de evento
      } catch (error) {
        console.error('Error fetching event types:', error);
      }
    };

    fetchEventData();
    fetchEventTypes();
  }, [id]);

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  // Actualizar el evento
  const handleUpdateEvent = async () => {
    try {
      const response = await fetch(`https://appiexamrecu.onrender.com/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el evento');
      }

      alert('Evento actualizado exitosamente');
      navigate('/'); // Navegar de regreso a la lista de eventos
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Actualizar Evento</h3>
      <div className="form-group">
        <input
          type="text"
          name="title"
          className="form-control mb-3"
          placeholder="Título"
          value={eventData.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          className="form-control mb-3"
          placeholder="Descripción"
          value={eventData.description}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="date"
          className="form-control mb-3"
          value={eventData.date}
          onChange={handleInputChange}
        />
        <select
          name="eventTypeId"
          className="form-control mb-3"
          value={eventData.eventTypeId}
          onChange={handleInputChange}
        >
          <option value={0}>Seleccione un tipo de evento</option>
          {eventTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={handleUpdateEvent}>
          Actualizar Evento
        </button>
      </div>
    </div>
  );
};

export default UpdateEvent;
