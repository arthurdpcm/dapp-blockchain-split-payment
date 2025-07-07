import { useState } from 'react';
import { useAccount } from '../../context/AccountContext';
import Loading from '../../components/Loading/Loading';
import {
  ContractMonitorTitle,
  Form,
  FormGroup,
  Input,
  Label,
  SubmitButton,
} from './PoolMonitor.styled';
import { useTranslation } from 'react-i18next';
import Container from '@/components/Container/Container';
import { getPool } from '@/services/api';
import type { PoolData } from '@/models/PoolData';
import PoolDetails from '@/components/PoolDetails/PoolDetails';

const PoolMonitor = () => {
  const { account } = useAccount();
  const { t } = useTranslation();

  // --- Form State ---
  const [poolId, setPoolId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // --- Data Fetching State ---
  const [isLoading, setIsLoading] = useState(false);
  const [poolData, setPoolData] = useState<PoolData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poolId) {
      alert(t('pool_id_required'));
      return;
    }
    setIsLoading(true);
    setPoolData(null);
    setError(null);
    try {
      const fromTimestamp = dateFrom
        ? (new Date(`${dateFrom}T00:00:00`).getTime() / 1000).toString()
        : undefined;
      const toTimestamp = dateTo
        ? (new Date(`${dateTo}T23:59:59`).getTime() / 1000).toString()
        : undefined;
      const data = await getPool(poolId, fromTimestamp, toTimestamp);
      // order by timestamp descending
      data.swaps.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));
      if (data.swaps.length === 0) {
        setError(t('no_swaps_found'));
      }
      setPoolData(data);
    } catch (err) {
      setError(t('pool_not_found_error'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <Container title={t('pool_monitor')} maxWidth="500px">
        <ContractMonitorTitle>{t('connect_wallet_to_view')}</ContractMonitorTitle>
      </Container>
    );
  }

  return (
    <Container title={t('pool_monitor')} maxWidth="800px">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="poolId">{t('pool_id')}</Label>
          <Input
            id="poolId"
            type="text"
            value={poolId}
            onChange={(e) => setPoolId(e.target.value)}
            placeholder={t('pool_id_placeholder')}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="dateFrom">{t('date_from')}</Label>
          <Input
            id="dateFrom"
            type="date"
            value={dateFrom}
            required={!!dateTo}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="dateTo">{t('date_to')}</Label>
          <Input
            id="dateTo"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </FormGroup>
        <SubmitButton type="submit" disabled={isLoading}>
          {t('monitor_pool')}
        </SubmitButton>
      </Form>

      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <Loading />
        </div>
      )}

      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '2rem' }}>{error}</p>}

      {poolData && (
        <div style={{ marginTop: '2rem' }}>
          <PoolDetails pool={poolData} />
        </div>
      )}
    </Container>
  );
};

export default PoolMonitor;
