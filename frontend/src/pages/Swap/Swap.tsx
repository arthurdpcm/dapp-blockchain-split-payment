import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  SwapBox,
  BoxLeft,
  BoxRight,
  BoxLabel,
  BoxInput,
  TokenSelector,
  TokenImage,
  TokenBalance,
  ArrowContainer,
  SwapButton,
  RateInfo,
  InfoBar,
  Title
} from './Swap.styled';
import { useTranslation } from 'react-i18next';
import { BRL_STABLECOINS, USD_STABLECOINS } from '../../constants/stablecoins';
import { getQuote } from '../../services/api';
import { useWallet } from '../../hooks/useWallet';
import { useTokenBalance } from '@/hooks/useTokenBalance';

const Swap: React.FC = () => {
  const [token0, setToken0] = useState(BRL_STABLECOINS[0]);
  const [token1, setToken1] = useState(USD_STABLECOINS[0]);
  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  // Estado para armazenar os dados da cotação
  const [quoteData, setQuoteData] = useState<{ rate: number; fee: number } | null>(null);
  // Estado para controlar a primeira interação do usuário
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  const {t} = useTranslation();
  const { account, connect } = useWallet();
  
  const token0BalanceString = useTokenBalance(token0.address);
  const token1BalanceString = useTokenBalance(token1.address);

  const amount0AsNumber = parseFloat(amount0) || 0;
  const token0Balance = parseFloat(token0BalanceString) || 0;
  const token1Balance = parseFloat(token1BalanceString) || 0;

  // Função para buscar a cotação, envolvida em useCallback para estabilidade
  const fetchQuote = useCallback(async () => {
    if (!token0?.address || !token1?.address) return;

    try {
      setIsQuoteLoading(true);
      const data = await getQuote(token0.address, token1.address);
      setQuoteData({
        rate: data.token0Price || 0,
        fee: data.feeTier || 0,
      });
      setIsQuoteLoading(false);
    } catch (e) {
      console.error('Error fetching quote:', e);
      setQuoteData(null); 
    }
  }, [token0, token1]);


  useEffect(() => {
    fetchQuote();

    const intervalId = setInterval(() => {
      if (hasUserInteracted) {
        fetchQuote();
      }
    }, 30000); // 30 segundos

    // limpa o intervalo quando o componente é desmontado ou os tokens mudam
    return () => clearInterval(intervalId);
  }, [fetchQuote, hasUserInteracted]);

  useEffect(() => {
    if (amount0AsNumber > 0 && quoteData?.rate) {
      const calculatedAmount = amount0AsNumber * quoteData.rate;
      setAmount1(calculatedAmount.toFixed(6));
    } else {
      setAmount1('');
    }
  }, [amount0AsNumber, quoteData]);


  const handleAmount0Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permite campo vazio ou números positivos
    if (value === '' || parseFloat(value) >= 0) {
        setAmount0(value);
        // Marca que o usuário interagiu pela primeira vez
        if (!hasUserInteracted) {
            setHasUserInteracted(true);
        }
    }
  };

  const isSwapDisabled = !account || token0Balance < amount0AsNumber || !amount0AsNumber;
  const showInsufficientBalance = account && token0Balance < amount0AsNumber && amount0AsNumber > 0;

  return (
    <Container>
      <div>
        <Title>{t('split_payment_swap')}</Title>
        {/* Vender */}
        <SwapBox>
            <BoxLeft>
            <BoxLabel>{t('Amount In')}</BoxLabel>
            <BoxInput
              type="number"
              placeholder="0.00"
              value={amount0}
              min="0"
              onChange={handleAmount0Change}
            />
            </BoxLeft>
          <BoxRight>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TokenImage src={token0.image} alt={token0.symbol} title={token0.name}/>
              <TokenSelector
                value={token0.address}
                onChange={e => {
                    const selected = BRL_STABLECOINS.find(t => t.address === e.target.value);
                    if (selected) setToken0(selected);
                }}
              >
                {BRL_STABLECOINS.map(token => (
                  <option key={token.symbol} value={token.address}>{token.symbol}</option>
                ))}
              </TokenSelector>
            </div>
            <TokenBalance>{account ? `${Math.floor(Number(token0Balance) * 100) / 100} ${token0.symbol}` : '-'}</TokenBalance>
          </BoxRight>
        </SwapBox>
        {/* Arrow */}
        <ArrowContainer>
          <span style={{ fontSize: 36}}>↓</span>
        </ArrowContainer>
        {/* Comprar */}
        <SwapBox>
          <BoxLeft>
            <BoxLabel>{t('Amount Out')}</BoxLabel>
            <BoxInput
              type="number"
              placeholder="0.00"
              value={amount1}
              readOnly
              style={{ color: '#fff' }}
              disabled
            />
          </BoxLeft>
          <BoxRight>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TokenImage src={token1.image} alt={token1.symbol} title={token1.name} />
              <TokenSelector
                value={token1.address}
                onChange={e => {
                    const selected = USD_STABLECOINS.find(t => t.address === e.target.value);
                    if (selected) setToken1(selected);
                }}
              >
                {USD_STABLECOINS.map(token => (
                  <option key={token.symbol} value={token.address}>{token.symbol}</option>
                ))}
              </TokenSelector>
            </div>
            <TokenBalance>{account ? `${Math.floor(Number(token1Balance) * 100) / 100} ${token1.symbol}` : '-'}</TokenBalance>
          </BoxRight>
        </SwapBox>
        {/* Swap Button */}
        {account ? (
          <SwapButton disabled={isSwapDisabled}>
            Swap
          </SwapButton>
        ) : (
          <SwapButton onClick={connect}>
            {t('connect_wallet')}
          </SwapButton>
        )}
        {/* Rate Info */}
        <RateInfo>
          {
            isQuoteLoading ? (
              <span style={{ color: '#aaa', fontSize: '0.95rem' }}>Loading...</span>
            ) : (
              <>
                <span style={{ color: '#aaa', fontSize: '0.95rem' }}>
                  {`1 ${token0.symbol} = ${quoteData?.rate.toFixed(4)} ${token1.symbol}`}
                </span>
                <span style={{ color: '#aaa', fontSize: '0.95rem' }}>
                  {t('pool_fee')}: {quoteData?.fee ? `${quoteData.fee / 10000}%` : 'N/A'}
                </span>
              </>
            )
          }

        </RateInfo>
        {/* Info Bar */}

        { showInsufficientBalance && (
          <InfoBar>
            <span style={{ fontWeight: 700 }}>⚠</span> {t('insufficient_symbol_for_swap', { symbol: token0.symbol })}
          </InfoBar>
        )}

      </div>
    </Container>
  );
};

export default Swap;
