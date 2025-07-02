import { useState, useEffect, useContext, useCallback } from 'react';
import { ethers, EventLog } from 'ethers';
import { AccountContext } from '@/context/AccountContext';
import { SplitPayment, TaxWallet } from '@/constants/contracts-addresses.json';
import SPLIT_PAYMENT_ABI from '@/constants/abi/SplitPayment.json';
import { STABLECOINS } from '@/constants/stablecoins';
import TOKEN_ABI from '@/constants/abi/Token.json';

// Tipagem para os argumentos do evento PaymentSplit
interface PaymentSplitArgs {
  recipient: string;
  tokenIn: string;
  amountIn: bigint;
  tokenOut: string;
  amountOut: bigint;
  feeTier: number;
  taxAmount: bigint;
}

// Tipagem para o evento formatado que será usado no frontend
interface FormattedPaymentEvent {
  recipient: string;
  tokenIn: string;
  amountIn: string;
  tokenOut: string;
  amountOut: string;
  feeTier: number;
  taxAmount: string;
  transactionHash: string;
}

export const useContractData = () => {
  const { provider } = useContext(AccountContext);
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [events, setEvents] = useState<FormattedPaymentEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getTokenDecimals = useCallback((tokenAddress: string): number => {
    const token = STABLECOINS.find((coin) => coin.address.toLowerCase() === tokenAddress.toLowerCase());
    return token ? token.decimals : 6; // Default para 6 decimais
  }, []);

  const fetchData = useCallback(async () => {
    if (!provider) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const balancePromises = STABLECOINS.map(async (coin) => {
        const tokenContract = new ethers.Contract(coin.address, TOKEN_ABI.abi, provider);
        const balance = await tokenContract.balanceOf(TaxWallet);
        if (balance === 0n) return undefined;

        return { [coin.symbol]: ethers.formatUnits(balance, coin.decimals) };
      });
      const balancesArray = await Promise.all(balancePromises);
      const filtered = balancesArray.filter((b): b is Record<string, string> => b !== undefined);
      const balancesMap = filtered.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setBalances(balancesMap);

      // Buscar eventos
      const contract = new ethers.Contract(SplitPayment, SPLIT_PAYMENT_ABI.abi, provider);
      const eventFilter = contract.filters.PaymentSplit();
      const pastEvents = await contract.queryFilter(eventFilter);
      const formattedEvents = (pastEvents.reverse() as (EventLog & { args: PaymentSplitArgs })[]).map((event) => ({
        recipient: event.args.recipient,
        tokenIn: STABLECOINS.find((coin) => coin.address.toLowerCase() === event.args.tokenIn.toLowerCase())?.symbol || 'Unknown',
        amountIn: ethers.formatUnits(event.args.amountIn, getTokenDecimals(event.args.tokenIn)),
        tokenOut: STABLECOINS.find((coin) => coin.address.toLowerCase() === event.args.tokenOut.toLowerCase())?.symbol || 'Unknown',
        amountOut: ethers.formatUnits(event.args.amountOut, getTokenDecimals(event.args.tokenOut)),
        feeTier: event.args.feeTier,
        taxAmount: ethers.formatUnits(event.args.taxAmount, getTokenDecimals(event.args.tokenIn)),
        transactionHash: event.transactionHash,
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching contract data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [provider, getTokenDecimals]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { balances, events, isLoading, refetch: fetchData };
};
