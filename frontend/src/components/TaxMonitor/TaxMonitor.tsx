import { useContext, useState } from 'react';
import { COLORS } from '../../constants/colors';
import { getBrlUsdSwaps } from '../../services/api';
import { useEffect } from 'react';
import type { BrlUsdSwapsByPool } from '../../models/BrlUsdSwapsByPool';
import Loading from '../Loading/Loading';
import {
  TaxMonitorContainer,
  TaxMonitorDescription,
  TaxMonitorDetailTitle,
  TaxMonitorDivider,
  TaxMonitorHeader,
  TaxMonitorRow,
  TaxMonitorTotal,
} from './TaxMonitor.styled';
import Button from '../ui/Button/Button';
import useIsMobile from '../../hooks/useIsMobile';
import { AccountContext } from '../../context/AccountContext';

function formatBRL(value: number) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const RefreshIcon = ({ size = 24, color = COLORS.purple }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 12c0-4.97-4.03-9-9-9-3.93 0-7.24 2.53-8.48 6.09"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M3 3v5h5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M3 12c0 4.97 4.03 9 9 9 3.93 0 7.24-2.53 8.48-6.09"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M21 21v-5h-5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const TaxMonitor = () => {
  const [brlUsdSwapsByPool, setBrlUsdSwapsByPool] = useState<BrlUsdSwapsByPool[]>([]);
  const { account } = useContext(AccountContext);
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    handleGetBrlUsdSwapsByPool();
  }, []);

  const handleGetBrlUsdSwapsByPool = () => {
    setIsLoading(true);
    getBrlUsdSwaps().then((data: BrlUsdSwapsByPool[]) => {
      if (Array.isArray(data)) {
        setBrlUsdSwapsByPool(data);
      }
      setIsLoading(false);
    });
  };

  return isLoading ? (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
    >
      <Loading />
    </div>
  ) : (
    <TaxMonitorContainer>
      <TaxMonitorHeader>
        <h2 className="tax-monitor-title">Tax Monitor</h2>
        <Button
          onClick={handleGetBrlUsdSwapsByPool}
          title="Refresh"
          isMobile={isMobile}
          isConnect={!!account}
          hasBorder={false}
          padding="small"
        >
          <RefreshIcon size={32} color={!!account ? COLORS.purple : COLORS.lightPurple} />
        </Button>
      </TaxMonitorHeader>
      <TaxMonitorDescription>
        Total transacionado entre BRL e USD stablecoins:
      </TaxMonitorDescription>
      <TaxMonitorTotal>
        {formatBRL(brlUsdSwapsByPool.reduce((acc, pool) => acc + pool.total_brl_to_usd, 0))}
      </TaxMonitorTotal>
      <TaxMonitorDivider>
        <TaxMonitorRow>
          <span>Taxa (3,5%)</span>
          <span style={{ color: COLORS.purple }}>
            {formatBRL(
              brlUsdSwapsByPool.reduce((acc, pool) => acc + pool.total_brl_to_usd, 0) * 0.035
            )}
          </span>
        </TaxMonitorRow>
        <div style={{ marginTop: 18 }}>
          <TaxMonitorDetailTitle className="tax-monitor-detail-title">
            Detalhamento por par:
          </TaxMonitorDetailTitle>
          {brlUsdSwapsByPool.map((pool) => (
            <TaxMonitorRow key={pool.pool_id} className="tax-monitor-row">
              <span>
                {pool.token0} / {pool.token1}
              </span>
              <span>{formatBRL(pool.total_brl_to_usd)}</span>
            </TaxMonitorRow>
          ))}
        </div>
      </TaxMonitorDivider>
    </TaxMonitorContainer>
  );
};

export default TaxMonitor;
