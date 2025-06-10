import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import TaxMonitor from './components/TaxMonitor/TaxMonitor';
import BRLSwap from './components/BRLSwap/BRLSwap';
import PoolPage from './components/PoolPage/PoolPage';
import { AccountProvider } from './context/AccountContext';
import i18n from './i18n'; // Assuming this is your i18n import

// Reference i18n to avoid unused variable warning
void i18n;

function App() {
  return (
    <Router>
      <AccountProvider>
        <Header />
        <div style={{ padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<TaxMonitor />} />
            <Route path="/brl-swap" element={<BRLSwap />} />
            <Route path="/pool/:id" element={<PoolPage />} />
          </Routes>
        </div>
      </AccountProvider>
    </Router>
  );
}

export default App;
