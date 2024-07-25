import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TopologiJaringan from './pages/TopologiJaringan';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/topologijaringan" />} />
        <Route path="/topologijaringan" element={<TopologiJaringan />} />
      </Routes>
    </Router>
  );
}

export default App;
