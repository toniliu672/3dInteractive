import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TopologiJaringan from './pages/TopologiJaringan';
import OSILayer from './pages/OSILayer';
import TransmisiJaringan from './pages/TransmisiJaringa';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/topologijaringan" />} />
        <Route path="/topologijaringan" element={<TopologiJaringan />} />
        <Route path="/osilayer" element={<OSILayer />} />
        <Route path="/transmisijaringan" element={<TransmisiJaringan />} />
      </Routes>
    </Router>
  );
}

export default App;
