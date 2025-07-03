import { useState } from 'react';
import { useContractData } from '../../hooks/useContractData';
import { useAccount } from '../../context/AccountContext';
import Loading from '../../components/Loading/Loading';
import {
  ContractMonitorTitle,
  ContractMonitorSection,
  ContractMonitorSectionTitle,
  BalanceList,
  BalanceListItem,
  EventList,
  EventCard,
  EventHeader,
  EventDetails,
  EventArg,
  PaginationContainer,
  PageButton,
  PageInfo,
} from './ContractMonitor.styled';
import { useTranslation } from 'react-i18next';
import Container from '@/components/Container/Container';

const ContractMonitor = () => {
  const { account } = useAccount();
  const { balances, events, isLoading } = useContractData();
  const { t } = useTranslation();

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Display 5 events per page

  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = events.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(events.length / itemsPerPage);

  if (isLoading) {
    return (
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
    );
  }

  if (!account) {
    return (
      <Container title={t('contract_monitor')} maxWidth="800px">
        <ContractMonitorTitle>{t('connect_wallet_to_view')}</ContractMonitorTitle>
      </Container>
    );
  }

  return (
    <Container title={t('contract_monitor')} maxWidth="800px">
      <ContractMonitorSection>
        {/* <p>{t('tax_wallet_address')}: {taxWalletAddress}</p> */}
        <ContractMonitorSectionTitle>{t('contract_balance')}</ContractMonitorSectionTitle>
        <BalanceList>
          {Object.entries(balances).map(([symbol, balance]) => (
            <BalanceListItem key={symbol}>
              <span>{symbol}</span>
              <span>{balance}</span>
            </BalanceListItem>
          ))}
        </BalanceList>
      </ContractMonitorSection>

      <ContractMonitorSection>
        <ContractMonitorSectionTitle>{t('payment_events')}</ContractMonitorSectionTitle>
        <EventList>
          {currentEvents.map((event) => (
            <EventCard key={event.transactionHash}>
              <EventHeader>PaymentSplit</EventHeader>
              <EventDetails>
                <EventArg>
                  <span>{t('recipient')}:</span> {event.recipient}
                </EventArg>
                <EventArg>
                  <span>{t('token_in')}:</span> {event.tokenIn}
                </EventArg>
                <EventArg>
                  <span>{t('amount_in')}:</span> {event.amountIn}
                </EventArg>
                <EventArg>
                  <span>{t('token_out')}:</span> {event.tokenOut}
                </EventArg>
                <EventArg>
                  <span>{t('amount_out')}:</span> {event.amountOut}
                </EventArg>
                <EventArg>
                  <span>{t('fee_tier')}:</span> {Number(event.feeTier) / 10000}%
                </EventArg>
                <EventArg>
                  <span>{t('tax_amount')}:</span> {event.taxAmount}
                </EventArg>
                <EventArg>
                  <span>{t('tx_hash')}:</span>
                  <a
                    href={`https://polygonscan.com/tx/${event.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#1a9c9c', textDecoration: 'none' }}
                  >
                    {event.transactionHash}
                  </a>
                </EventArg>
              </EventDetails>
            </EventCard>
          ))}
        </EventList>
        {totalPages > 1 && (
          <PaginationContainer>
            <PageButton
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              {t('previous')}
            </PageButton>
            <PageInfo>
              {t('page')} {currentPage} {t('of')} {totalPages}
            </PageInfo>
            <PageButton
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              {t('next')}
            </PageButton>
          </PaginationContainer>
        )}
      </ContractMonitorSection>
    </Container>
  );
};

export default ContractMonitor;
