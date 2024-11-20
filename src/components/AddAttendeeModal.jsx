import React, { useState, useEffect } from 'react';

const AddAttendeeModal = ({ eventId, onClose, onAddAttendee }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState(0);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true); // Cargar los roles
  const [error, setError] = useState(null); // Para manejar errores al cargar roles

  // Obtener los roles cuando el componente se monta
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('https://appiexamrecu.onrender.com/api/roles', {
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) {
          throw new Error('Error al obtener los roles');
        }
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !roleId) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://appiexamrecu.onrender.com/api/attendees', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: 0, name, email, eventId: parseInt(eventId), roleId }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar el asistente');
      }

      const newAttendee = await response.json();
      onAddAttendee(newAttendee); // Actualizar la lista de asistentes
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agregar Asistente</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Rol</label>
                <select
                  className="form-select"
                  value={roleId}
                  onChange={(e) => setRoleId(parseInt(e.target.value))}
                  disabled={roleLoading} // Deshabilitar el select mientras cargan los roles
                  required
                >
                  <option value={0}>Seleccionar rol...</option>
                  {!roleLoading &&
                    roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name} - {role.description}
                      </option>
                    ))}
                </select>
                {roleLoading && <div className="spinner-border text-primary mt-2" role="status" />}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Guardando...' : 'Agregar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAttendeeModal;
