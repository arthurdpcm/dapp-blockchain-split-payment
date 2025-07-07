import React, { useEffect, useState, useCallback } from 'react';
import {
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
  FeeDetails,
  FeeItem,
  EstimateGasButton,
} from './Swap.styled';
import { useTranslation } from 'react-i18next';
import { BRL_STABLECOINS, USD_STABLECOINS } from '@/constants/stablecoins';
import { getQuote } from '@/services/api';
import { useWallet } from '@/hooks/useWallet';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useSwap } from '@/hooks/useSwap';
import Modal from '@/components/Modal/Modal';
import Loading from '@/components/Loading/Loading';
import Container from '@/components/Container/Container';
import { Link } from 'react-router-dom';

const Swap: React.FC = () => {
  const [tokenIn, setTokenIn] = useState(BRL_STABLECOINS[0]);
  const [tokenOut, setTokenOut] = useState(USD_STABLECOINS[0]);
  const [amount0, setAmount0] = useState('');
  const [amount1, setAmount1] = useState('');
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [isSwapLoading, setIsSwapLoading] = useState(false);
  const [quoteData, setQuoteData] = useState<{ rate: number; fee: number } | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimatedGas, setEstimatedGas] = useState<string | null>(null);

  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    success: boolean;
    message: string;
  } | null>(null);

  const { t } = useTranslation();
  const { account, connect } = useWallet();
  const { executeSwap, isSwapping, estimateGasForSwap } = useSwap();

  // Atualize a forma como você chama o hook
  const { balance: tokenInBalanceString, refreshBalance: refreshTokenInBalance } = useTokenBalance(
    tokenIn.address
  );
  const { balance: tokenOutBalanceString, refreshBalance: refreshTokenOutBalance } =
    useTokenBalance(tokenOut.address);

  const amount0AsNumber = parseFloat(amount0) || 0;
  const tokenInBalance = parseFloat(tokenInBalanceString) || 0;
  const tokenOutBalance = parseFloat(tokenOutBalanceString) || 0;

  const fetchQuote = useCallback(async () => {
    if (!tokenIn?.address || !tokenOut?.address) return;

    try {
      setIsQuoteLoading(true);
      const data = await getQuote(tokenIn.address, tokenOut.address);
      setQuoteData({
        rate: data.token1Price || 0,
        fee: data.feeTier || 0,
      });
      setIsQuoteLoading(false);
    } catch (e) {
      console.error('Error fetching quote:', e);
      setQuoteData(null);
    }
  }, [tokenIn, tokenOut]);

  const handleEstimateGas = useCallback(async () => {
    if (!quoteData || !amount0) return;
    setIsEstimating(true);
    const gas = await estimateGasForSwap({
      tokenInAddress: tokenIn.address,
      tokenOutAddress: tokenOut.address,
      amountIn: amount0,
      fee: quoteData.fee,
      tokenInDecimals: tokenIn.decimals,
    });
    setEstimatedGas(gas);
    setIsEstimating(false);
  }, [estimateGasForSwap, tokenIn, tokenOut, amount0, quoteData]);

  const handleSwapClick = () => {
    if (isSwapDisabled) return;
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSwap = async () => {
    setIsConfirmModalOpen(false);

    if (!account || !tokenIn.address || !tokenOut.address || amount0AsNumber <= 0) {
      setFeedbackModal({
        open: true,
        success: false,
        message: t('swap_error_invalid_input'),
      });
      return;
    }
    setIsSwapLoading(true);
    try {
      const swapResult = await executeSwap({
        tokenInAddress: tokenIn.address,
        tokenOutAddress: tokenOut.address,
        amountIn: amount0,
        fee: 500,
        tokenInDecimals: tokenIn.decimals,
      });

      if (swapResult?.txHash) {
        setFeedbackModal({
          open: true,
          success: true,
          message: t('swap_success_tx_hash', { txHash: swapResult.txHash }),
        });
        refreshTokenInBalance();
        refreshTokenOutBalance();
        setAmount0('');
        setAmount1('');
        setHasUserInteracted(false);
      } else if (swapResult?.error) {
        setFeedbackModal({
          open: true,
          success: false,
          message: `${t('swap_error')} ${swapResult.error}`,
        });
      }
    } catch (error) {
      setFeedbackModal({
        open: true,
        success: false,
        message: t('swap_error_generic'),
      });
    } finally {
      setIsSwapLoading(false);
    }
  };

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
    // Limpa a estimativa de gás se o valor ou os tokens mudarem
    setEstimatedGas(null);
  }, [amount0, tokenIn, tokenOut]);

  useEffect(() => {
    if (amount0AsNumber > 0 && quoteData?.rate) {
      // A taxa do contrato (1.1%) é aplicada sobre o valor de entrada
      const contractTax = amount0AsNumber * 0.011;
      const netAmountAfterContractTax = amount0AsNumber - contractTax;
      const poolFeeTax = netAmountAfterContractTax * (quoteData.fee / (10000 * 100));
      const calculatedAmount = (netAmountAfterContractTax - poolFeeTax) * quoteData.rate;
      setAmount1(calculatedAmount.toFixed(6));
    } else {
      setAmount1('');
    }
  }, [amount0AsNumber, quoteData, estimatedGas]);

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

  const isSwapDisabled =
    !account || tokenInBalance < amount0AsNumber || !amount0AsNumber || isSwapping;
  const showInsufficientBalance =
    account && tokenInBalance < amount0AsNumber && amount0AsNumber > 0;

  return isSwapLoading ? (
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
    <Container title={t('split_payment_swap')} maxWidth="600px">
      <div>
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
              <TokenImage src={tokenIn.image} alt={tokenIn.symbol} title={tokenIn.name} />
              <TokenSelector
                value={tokenIn.address}
                onChange={(e) => {
                  const selected = BRL_STABLECOINS.find((t) => t.address === e.target.value);
                  if (selected) setTokenIn(selected);
                }}
              >
                {BRL_STABLECOINS.map((token) => (
                  <option key={token.symbol} value={token.address}>
                    {token.symbol}
                  </option>
                ))}
              </TokenSelector>
            </div>
            <TokenBalance>
              {account
                ? `${Math.floor(Number(tokenInBalance) * 10000) / 10000} ${tokenIn.symbol}`
                : '-'}
            </TokenBalance>
          </BoxRight>
        </SwapBox>

        <ArrowContainer>
          <span style={{ fontSize: 36 }}>↓</span>
        </ArrowContainer>

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
              <TokenImage src={tokenOut.image} alt={tokenOut.symbol} title={tokenOut.name} />
              <TokenSelector
                value={tokenOut.address}
                onChange={(e) => {
                  const selected = USD_STABLECOINS.find((t) => t.address === e.target.value);
                  if (selected) setTokenOut(selected);
                }}
              >
                {USD_STABLECOINS.map((token) => (
                  <option key={token.symbol} value={token.address}>
                    {token.symbol}
                  </option>
                ))}
              </TokenSelector>
            </div>
            <TokenBalance>
              {account
                ? `${Math.floor(Number(tokenOutBalance) * 10000) / 10000} ${tokenOut.symbol}`
                : '-'}
            </TokenBalance>
          </BoxRight>
        </SwapBox>

        {account ? (
          <SwapButton disabled={isSwapDisabled} onClick={handleSwapClick}>
            {isSwapping ? t('processing') : t('swap')}
          </SwapButton>
        ) : (
          <SwapButton onClick={connect}>{t('connect_wallet')}</SwapButton>
        )}

        <FeeDetails>
          <FeeItem>
            <span>{t('contract_fee')}</span>
            <span>1.1%</span>
          </FeeItem>
          <FeeItem>
            <span>{t('uniswap_pool_fee')}</span>
            <span>{quoteData?.fee ? `${quoteData.fee / 10000}%` : 'N/A'}</span>
          </FeeItem>
          <FeeItem>
            <span>{t('gas_fee_estimate')}</span>
            <span>{estimatedGas ? `~${parseFloat(estimatedGas).toFixed(6)} POL` : 'N/A'}</span>
          </FeeItem>
        </FeeDetails>

        {account && (
          <EstimateGasButton
            onClick={handleEstimateGas}
            disabled={isEstimating || amount0AsNumber <= 0}
          >
            {isEstimating ? t('estimating') : t('estimate_gas')}
          </EstimateGasButton>
        )}

        <RateInfo>
          {isQuoteLoading ? (
            <span style={{ color: '#aaa', fontSize: '0.95rem' }}>Loading...</span>
          ) : (
            <>
              <span style={{ color: '#aaa', fontSize: '0.95rem' }}>
                {`1 ${tokenIn.symbol} = ${quoteData?.rate.toFixed(6)} ${tokenOut.symbol}`}
              </span>
            </>
          )}
        </RateInfo>

        {showInsufficientBalance && (
          <InfoBar>
            <span style={{ fontWeight: 700 }}>⚠</span>{' '}
            {t('insufficient_symbol_for_swap', { symbol: tokenIn.symbol })}
          </InfoBar>
        )}
      </div>

      {/* Modal de confirmação do swap */}
      <Modal
        open={isConfirmModalOpen}
        onConfirm={handleConfirmSwap}
        onClose={() => setIsConfirmModalOpen(false)}
        title={t('confirm_swap_title')}
      >
        {t('confirm_swap_text', {
          amountIn: amount0,
          tokenIn: tokenIn.symbol,
          amountOut: amount1,
          tokenOut: tokenOut.symbol,
        })}
        <div style={{ marginTop: '1rem' }}>
          <p>
            {t('swap_more_info')}
            <Link
              to="/about"
              style={{ color: '#1a9c9c', textDecoration: 'underline', margin: '0 4px' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('click_here')}
            </Link>
          </p>
        </div>
      </Modal>


      <Modal
        open={!!feedbackModal?.open}
        onConfirm={() => setFeedbackModal(null)}
        onClose={() => setFeedbackModal(null)}
        isNotificationModal={true}
        title={feedbackModal?.success ? t('success') : t('error')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <img
            src={feedbackModal?.success ? '/success.svg' : '/error.svg'}
            alt={feedbackModal?.success ? 'Success' : 'Error'}
            style={{ width: 96, height: 96, marginBottom: 8 }}
          />
          <span style={{ textAlign: 'center' }}>{feedbackModal?.message}</span>
        </div>
      </Modal>
    </Container>
  );
};

export default Swap;
