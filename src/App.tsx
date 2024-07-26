import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TopologiJaringan from './pages/TopologiJaringan';
import OSILayer from './pages/OSILayer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/topologijaringan" />} />
        <Route path="/topologijaringan" element={<TopologiJaringan />} />
        <Route path="/osilayer" element={<OSILayer />} />
      </Routes>
    </Router>
  );
}

export default App;
