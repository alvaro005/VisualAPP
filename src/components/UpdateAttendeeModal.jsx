import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateAttendeeModal = ({ attendee, onClose, onUpdateAttendee }) => {
  const [name, setName] = useState(attendee.name || '');
  const [email, setEmail] = useState(attendee.email || '');
  const [roleId, setRoleId] = useState(attendee.Role?.id || 1); // Valor predeterminado para el rol
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // Obtener los roles disponibles
    const fetchRoles = async () => {
      try {
        const response = await fetch('https://appiexamrecu.onrender.com/api/roles');
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Error al cargar roles:', error);
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedAttendee = {
      id: attendee.id,
      name,
      email,
      roleId,
    };
    onUpdateAttendee(updatedAttendee); // Actualizar el asistente
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Actualizar Asistente</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label">Rol</label>
                <select
                  id="role"
                  className="form-control"
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-end">
                <button type="submit" className="btn btn-primary">Actualizar</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={onClose}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAttendeeModal;
