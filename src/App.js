import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AverageCost from './pages/AverageCost';
import MyCost from './pages/MyCost';
import Comparison from './pages/Comparison';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AverageCost />} />
          <Route path="/mycost" element={<MyCost />} />
          <Route path="/comparison" element={<Comparison />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
