import { useState } from 'react';
import { COLORS } from '../../constants/colors';
import { getBrlUsdSwaps } from '../../services/api';
import { useEffect } from 'react';
import type { BrlUsdSwapsByPool } from '../../models/BrlUsdSwapsByPool';
import Loading from '../../components/Loading/Loading';
import {
  TaxMonitorDescription,
  TaxMonitorDetailTitle,
  TaxMonitorDivider,
  TaxMonitorHeader,
  TaxMonitorRow,
  TaxMonitorTotal,
  TaxMonitorTable,
  TaxMonitorTableHead,
  TaxMonitorTableHeader,
  TaxMonitorTableRow,
  TaxMonitorTableCell,
} from './TaxMonitor.styled';
import Button from '../../components/ui/Button/Button';
import useIsMobile from '../../hooks/useIsMobile';
import { useAccount } from '../../context/AccountContext';
import { useTranslation } from 'react-i18next';
import Container from '@/components/Container/Container';

function formatBRL(value: number) {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const RefreshIcon = ({ size = '2rem', color = COLORS.oceanBlue }) => (
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
  const { account } = useAccount();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

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

  const totalTransacted = brlUsdSwapsByPool.reduce((acc, pool) => acc + pool.total_brl_to_usd, 0);

  return isLoading ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Loading />
    </div>
  ) : (
    <Container
      title={
        <TaxMonitorHeader>
          {t('tax_monitor')}
          <Button
            onClick={handleGetBrlUsdSwapsByPool}
            title={t('refresh')}
            isMobile={isMobile}
            isConnect={!!account}
            hasBorder={false}
            padding="small"
          >
            <RefreshIcon size={'2rem'} />
          </Button>
        </TaxMonitorHeader>
      }
      maxWidth="800px"
    >
      <TaxMonitorDescription>
        {t('total_transacted')} ({new Date().getMonth() + 1}):
      </TaxMonitorDescription>
      <TaxMonitorTotal>{formatBRL(totalTransacted)}</TaxMonitorTotal>
      <TaxMonitorDivider>
        <TaxMonitorRow
          style={{ cursor: 'pointer' }}
          onClick={() => window.location.replace('about')}
        >
          <span>{t('tax')}</span>
          <span style={{ color: COLORS.oceanBlue }}>{formatBRL(totalTransacted * 0.011)}</span>
        </TaxMonitorRow>
        <div style={{ marginTop: 18 }}>
          <TaxMonitorDetailTitle>{t('details')}</TaxMonitorDetailTitle>
          <TaxMonitorTable>
            <TaxMonitorTableHead>
              <TaxMonitorTableHeader>{t('pair') || 'Pair'}</TaxMonitorTableHeader>
              <TaxMonitorTableHeader style={{ textAlign: 'right' }}>
                {t('total') || 'Total'}
              </TaxMonitorTableHeader>
            </TaxMonitorTableHead>
            <tbody>
              {brlUsdSwapsByPool.map((pool) => (
                <TaxMonitorTableRow
                  key={pool.pool_id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => (window.location.href = `/pool/${pool.pool_id}`)}
                >
                  <TaxMonitorTableCell>
                    {pool.token0} / {pool.token1}
                  </TaxMonitorTableCell>
                  <TaxMonitorTableCell>{formatBRL(pool.total_brl_to_usd)}</TaxMonitorTableCell>
                </TaxMonitorTableRow>
              ))}
            </tbody>
          </TaxMonitorTable>
        </div>
      </TaxMonitorDivider>
    </Container>
  );
};

export default TaxMonitor;
