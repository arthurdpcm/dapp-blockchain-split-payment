import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import TaxMonitor from './components/TaxMonitor/TaxMonitor';
import BRLSwap from './components/BRLSwap/BRLSwap';
import { AccountProvider } from './context/AccountContext';

function App() {
  return (
    <Router>
      <AccountProvider>
        <Header />
        <div style={{ padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<TaxMonitor />} />
            <Route path="/brl-swap" element={<BRLSwap />} />
          </Routes>
        </div>
      </AccountProvider>
    </Router>
  );
}

export default App;
