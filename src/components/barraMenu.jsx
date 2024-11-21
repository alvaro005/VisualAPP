import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const MenuBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">Eventos App</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/events">Eventos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/create-event">Crear Evento</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/attendees">Asistentes</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;
