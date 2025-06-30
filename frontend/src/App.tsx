import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaxMonitor from './pages/TaxMonitor/TaxMonitor';
import Swap from './pages/Swap/Swap';
import PoolPage from './pages/PoolPage/PoolPage';
import { AccountProvider } from './context/AccountContext';
import i18n from './i18n'; // Assuming this is your i18n import
import ContractMonitor from './pages/ContractMonitor/ContractMonitor';
import About from './pages/About/About';
import MainLayout from './components/MainLayout/MainLayout';

void i18n;

function App() {
  return (
    <Router>
      <AccountProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<TaxMonitor />} />
            <Route path="/swap" element={<Swap />} />
            <Route path="/pool/:id" element={<PoolPage />} />
            <Route path="/contract-monitor" element={<ContractMonitor />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Route>
        </Routes>
      </AccountProvider>
    </Router>
  );
}

export default App;
