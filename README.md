# DApp de Split Payment e Swap na Blockchain

Bem-vindo ao projeto de Split Payment! Esta é uma aplicação descentralizada (DApp) full-stack que permite aos usuários realizar swaps de tokens e dividir pagamentos de forma segura e transparente na blockchain Polygon, utilizando a liquidez do Uniswap V3.

## ✨ Visão Geral

O projeto é uma solução completa que integra um frontend moderno, um backend de serviços e um smart contract robusto para criar uma experiência de usuário fluida e funcional no ecossistema DeFi. O principal caso de uso é permitir a troca de stablecoins atreladas ao Real (BRL) por stablecoins atreladas ao Dólar (USD), com a lógica de pagamento sendo executada on-chain.

---

## 🏛️ Arquitetura do Projeto

O sistema é dividido em três componentes principais, cada um em seu próprio diretório:

### 📄 **`/split-payment-pilot` (Smart Contract)**
O coração da aplicação. Um contrato inteligente escrito em Solidity e desenvolvido com o framework Hardhat.
-   **Responsabilidades:** Executar a lógica de swap de tokens e a divisão de pagamentos de forma atômica e segura na blockchain.
-   **Tecnologias:** Solidity, Hardhat, Uniswap V3, OpenZeppelin, Foundry (Anvil).

### ⚙️ **`/api` (Backend)**
Um serviço de API construído em Python com FastAPI que atua como uma camada de suporte off-chain.
-   **Responsabilidades:** Fornecer dados em tempo real para o frontend, como cotações de preços e as melhores pools de liquidez, consultando o subgraph do Uniswap V3 (The Graph) melhorando a experiência do usuário.
-   **Tecnologias:** Python, FastAPI, The Graph.

### 💻 **`/frontend` (Interface do Usuário)**
A interface web com a qual o usuário interage, desenvolvida com React e TypeScript.
-   **Responsabilidades:** Permitir que os usuários conectem suas carteiras (e.g., MetaMask), visualizem cotações em tempo real, aprovem o uso de tokens e iniciem as transações que interagem com o smart contract.
-   **Tecnologias:** React, TypeScript, Ethers.js, Styled-Components.

---

## 🚀 Como Funciona (Fluxo Básico)

1.  **Conexão:** O usuário acessa o frontend e conecta sua carteira digital.
2.  **Seleção:** O usuário escolhe os tokens que deseja trocar (ex: BRLA para USDC) e insere o valor.
3.  **Cotação:** O frontend solicita uma cotação ao backend (`/api`).
4.  **Busca Off-chain:** O backend consulta o The Graph para encontrar as informações de swap do par selecionado.
5.  **Exibição:** O frontend exibe a cotação recebida (taxa de câmbio e taxa do pool) para o usuário.
6.  **Transação On-chain:** Se o usuário aceitar, ele aprova a transação em sua carteira, que chama a função `splitAndSwapPayment` no smart contract.
7.  **Execução:** O smart contract executa o swap de forma segura e atômica na blockchain Polygon.

---

## 🧭 Como Navegar

Para obter instruções detalhadas sobre como configurar, testar e executar cada componente, por favor, consulte os arquivos `README.md` dentro de seus respectivos diretórios:

-   **Para o Smart Contract:** [`/split-payment-pilot/README.MD`](./split-payment-pilot/README.MD)
-   **Para o Backend:** [`/backend/README.md`](./backend/README.md)
-   **Para o Frontend:** [`/frontend/README.md`](./frontend/README.md)

Este README principal serve como um ponto de partida para entender a estrutura e o propósito geral do projeto.
