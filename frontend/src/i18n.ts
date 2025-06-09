import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        tax_monitor: "Tax Monitor",
        total_transacted: "Total transacted between BRL and USD stablecoins:",
        tax: "Tax (3.5%)",
        details: "Details by pair:",
        loading: "Loading, please wait...",
        connect_wallet: "Connect Wallet",
        disconnect_wallet: "Disconnect Wallet",
        swap: "Swap",
        swap_brl_usd: "Swap BRL/USD",
        your_balance: "Your Balance",
        amount: "Amount",
        confirm: "Confirm",
        cancel: "Cancel",
        refresh: "Refresh",
        error: "An error occurred",
        success: "Operation successful",
        pair: "Pair",
        total: "Total",
      },
    },
    pt: {
      translation: {
        tax_monitor: "Monitor de Taxas",
        total_transacted: "Total transacionado entre BRL e USD stablecoins:",
        tax: "Taxa (3,5%)",
        details: "Detalhamento por par:",
        loading: "Carregando, por favor aguarde...",
        connect_wallet: "Conectar Carteira",
        disconnect_wallet: "Desconectar Carteira",
        swap: "Trocar",
        swap_brl_usd: "Trocar BRL/USD",
        your_balance: "Seu Saldo",
        amount: "Quantidade",
        confirm: "Confirmar",
        cancel: "Cancelar",
        refresh: "Atualizar",
        error: "Ocorreu um erro",
        success: "Operação realizada com sucesso",
        pair: "Par",
        total: "Total",
      },
    },
  },
  lng: "en", // default language
  fallbackLng: "en", // fallback language
});

export default i18n;