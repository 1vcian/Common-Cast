import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'; // Importa gli stili personalizzati
import './App.css';
import ComparisonPage from './components/ComparisonPage';

function App() {
  return (
    <Router>
      <div className="App animated-gradient" style={{ display: 'flex' }}>
     
        <main className="container">
          <Routes>
            <Route path="/" element={<ComparisonPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;