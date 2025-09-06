import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AverageCost from './pages/AverageCost';
import MyCost from './pages/MyCost';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AverageCost />} />
          <Route path="/mycost" element={<MyCost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
