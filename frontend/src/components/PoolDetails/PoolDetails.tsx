import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PoolData } from '@/models/PoolData';
import useIsMobile from '@/hooks/useIsMobile';
import Container from '@/components/Container/Container';
import { TaxMonitorDescription, TaxMonitorTotal } from '@/pages/TaxMonitor/TaxMonitor.styled';
import { Button } from '@/components/ui/Button/Button.styled';
import { FirstLastSpan, PoolHeader, ExternalLink } from './PoolDetails.styled';
// import { Link } from 'react-router-dom';

interface PoolDetailsProps {
  pool: PoolData;
}

function formatDate(timestamp: string) {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString();
}

const PAGE_SIZE = 10;

const PoolDetails = ({ pool }: PoolDetailsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  if (!pool || pool.swaps.length === 0) {
    return (
      <Container title={t('pool_details')} maxWidth="800px">
        <TaxMonitorDescription>{t('no_swaps_found')}</TaxMonitorDescription>
      </Container>
    );
  }

  const token0 = pool.swaps[0]?.token0.symbol || '';
  const token1 = pool.swaps[0]?.token1.symbol || '';

  const totalPages = Math.ceil(pool.swaps.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const swapsPage = pool.swaps.slice(startIdx, endIdx);

  return (
    <>
      {/* <Container title={`${token0} / ${token1}`} maxWidth="800px"> */}
      <PoolHeader>
        <span>
          {token0} / {token1}
        </span>
        <ExternalLink
          target="_blank"
          to={`https://www.geckoterminal.com/polygon_pos/pools/${pool.pool_id}`}
        >
          <img height={32} src="/gecko_terminal.svg" alt="Gecko Terminal Logo" />
        </ExternalLink>
      </PoolHeader>
      <TaxMonitorDescription>{t('total_swaps_period')}:</TaxMonitorDescription>
      <TaxMonitorTotal>{pool.swaps.length} swaps</TaxMonitorTotal>
      <TaxMonitorDescription style={{ marginTop: 16 }}>
        Pool ID: {pool.pool_id}
      </TaxMonitorDescription>
      <h3 style={{ margin: '1.2rem 0 0.6rem' }}>{t('details')}</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
        <thead>
          <tr style={{ background: 'rgba(26,156,156,0.08)' }}>
            <th
              style={{ textAlign: 'left', padding: '6px 8px', fontWeight: 600, fontSize: '1rem' }}
            >
              {t('pair')}
            </th>
            <th
              style={{ textAlign: 'right', padding: '6px 8px', fontWeight: 600, fontSize: '1rem' }}
            >
              {t('amount0')}
            </th>
            <th
              style={{ textAlign: 'right', padding: '6px 8px', fontWeight: 600, fontSize: '1rem' }}
            >
              {t('amount1')}
            </th>
            <th
              style={{ textAlign: 'right', padding: '6px 8px', fontWeight: 600, fontSize: '1rem' }}
            >
              {t('timestamp')}
            </th>
          </tr>
        </thead>
        <tbody>
          {swapsPage.map((swap, idx) => (
            <tr key={idx + startIdx} style={{ borderBottom: '1px solid #e0e0e0' }}>
              <td style={{ padding: '6px 8px' }}>
                {swap.token0.symbol} / {swap.token1.symbol}
              </td>
              <td style={{ padding: '6px 8px', textAlign: 'right' }}>{swap.amount0}</td>
              <td style={{ padding: '6px 8px', textAlign: 'right' }}>{swap.amount1}</td>
              <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                {formatDate(swap.timestamp)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
            marginTop: 16,
          }}
        >
          <Button
            hasBorder={false}
            isMobile={isMobile}
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <FirstLastSpan>{'<<'}</FirstLastSpan>
          </Button>
          <Button
            hasBorder={false}
            isMobile={isMobile}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            {t('previous')}
          </Button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <Button
            hasBorder={false}
            isMobile={isMobile}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            {t('next')}
          </Button>
          <Button
            hasBorder={false}
            isMobile={isMobile}
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <FirstLastSpan>{'>>'}</FirstLastSpan>
          </Button>
        </div>
      )}
      {/* </Container> */}
    </>
  );
};

export default PoolDetails;
