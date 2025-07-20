# Split Payment DApp Frontend

Este é o frontend do projeto Split Payment DApp, uma aplicação web para swap de stablecoins BRL e USD na blockchain Polygon.

## Funcionalidades

- Swap entre stablecoins BRL e USD
- Detecção automática de saldo do token selecionado na carteira conectada
- Integração com MetaMask e fallback para RPC público da Polygon
- Interface moderna e responsiva
- Internacionalização (i18n) com suporte a português e inglês

## Tecnologias Utilizadas

- React + Vite
- TypeScript
- ethers.js
- styled-components
- i18next

## Como rodar localmente

1. Instale as dependências:
   ```sh
   npm install
   ```
2. **Renomeie o arquivo `.env.example` para `.env` na raiz da pasta `frontend/` e defina as suas varíaveis.**


3. Rode o projeto:

   ```sh
   npm run dev
   ```

4. Acesse em [http://localhost:5173](http://localhost:5173)

## Estrutura de Pastas

- `src/pages/Swap/` — Página principal de swap
- `src/constants/` — Listas de tokens e cores
- `src/hooks/` — Hooks customizados para carteira e saldo ERC20
- `src/context/` — Contexto global de conta
- `src/components/` — Componentes reutilizáveis

## Observações

- Certifique-se de estar conectado à rede Polygon na MetaMask para interagir com os tokens.
- O saldo exibido é do token selecionado na carteira conectada.
- O botão de swap só é habilitado se houver saldo suficiente.

## Licença

MIT
