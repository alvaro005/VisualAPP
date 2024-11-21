import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventsList from './components/EventsList';
import UpdateEvent from './components/UpdateEvent';
import EventAttendees from './components/EventAttendees';
import './App.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EventsList />} />
        <Route path="/update-event/:id" element={<UpdateEvent />} />
        <Route path="/events/:id/attendees" element={<EventAttendees />} />
      </Routes>
    </Router>
  );
}

export default App;
