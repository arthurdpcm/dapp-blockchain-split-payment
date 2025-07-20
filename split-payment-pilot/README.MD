# 💵 Split Payment Smart Contract

Bem-vindo ao repositório do Split Payment Smart Contract! Este projeto apresenta um contrato inteligente robusto para facilitar pagamentos divididos, com suporte para tokens ERC-20, integração com Uniswap V3 para swaps e uma suíte de testes completa rodando em um fork da mainnet da Polygon.

Este README vai te guiar desde a configuração do ambiente até a implantação, interação e análise de segurança do contrato.

# 👀 Visão Geral do Contrato

O `SplitPayment` é um contrato inteligente projetado para distribuir fundos de forma programática. As principais funcionalidades incluem:

- **Divisão de Pagamentos**: Permite que fundos (ETH/MATIC ou tokens ERC-20) sejam enviados para um destinatário principal, com uma porcentagem sendo retida como imposto para uma `taxWallet`.
- **Suporte a Stablecoins**: Permite ao dono do contrato registrar e desregistrar endereços de tokens que são considerados stablecoins, facilitando a gestão de taxas e swaps.
- **Integração com Uniswap V3**: O contrato pode interagir com o router da Uniswap V3 para realizar swaps de tokens. Por exemplo, trocar um token recebido por uma stablecoin antes de repassar ao destinatário.
- **Segurança**: Funções críticas são protegidas com o modificador `onlyOwner`.

# 🛠️ Tecnologias Envolvidas

Este projeto utiliza um conjunto de ferramentas poderosas do ecossistema de desenvolvimento blockchain:

- **Hardhat**: Ambiente de desenvolvimento para compilar, implantar, testar e depurar contratos Solidity.
- **Foundry (Anvil)**: Um framework de desenvolvimento ultra-rápido para Ethereum, usado aqui para forking local da mainnet da Polygon.
- **Ethers.js**: Biblioteca para interagir com a blockchain Ethereum/EVM usando JavaScript/TypeScript.
- **solidity-coverage**: Plugin do Hardhat para gerar relatórios de cobertura de código.
- **Mythril**: Ferramenta de análise de segurança para detectar vulnerabilidades em contratos.
- **The Graph**: Utilizado nos testes para consultar dinamicamente dados de pools da Uniswap V3, como a `feeTier` correta.
- **dotenv**: Para gerenciar variáveis de ambiente de forma segura.

# 1. Primeiros Passos: Configuração e Instalação

Para começar a trabalhar com este projeto, siga os passos abaixo.

### Pré-requisitos
- [Node.js](https://nodejs.org/en/) (versão 18.x ou superior)
- [Foundry](https://getfoundry.sh/)

### Instalação

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/arthurdpcm/dapp-blockchain-split-payment.git
    cd dapp-blockchain-split-payment/split-payment-pilot
    ```

2.  **Instale as dependências do Node.js:**
    ```bash
    npm install
    ```

3.  **Instale o Foundry (se ainda não tiver):**
    ```bash
    curl -L https://foundry.paradigm.xyz | bash
    foundryup # Garante que você tem a última versão
    anvil --version
    ```

4.  **Renomeie o arquivo `.env.example` para `.env` na raiz da pasta `split-payment-pilot/` e defina as suas varíaveis.**

# 2. Rodando um Fork Local da Polygon com Anvil

Para testar e interagir com o contrato em um ambiente realista, vamos usar o Anvil para criar um fork da mainnet da Polygon. Isso nos dá acesso a todos os contratos e dados da mainnet (como tokens e pools da Uniswap) em um ambiente de desenvolvimento local e rápido.

Abra um novo terminal e execute:
```bash
anvil --fork-url $POLYGON_MAINNET_RPC_URL
# Se você não configurou a variável de ambiente no seu shell, pode passar a URL diretamente:
# anvil --fork-url https://polygon-rpc.com
```
Anvil iniciará um nó local na porta `8545`, espelhando o estado da Polygon. **Mantenha este terminal aberto.**

# 3. Ciclo de Vida do Contrato

Com o ambiente configurado e o Anvil rodando, você pode compilar, testar e implantar o contrato.

### Compilação
Compile os contratos inteligentes:
```bash
npx hardhat compile
```

### Testes
Execute a suíte de testes. Os testes são configurados para rodar no fork do Anvil, interagindo com tokens e pools reais da Uniswap.
```bash
npx hardhat test
```
Os testes cobrem:
- Funcionalidades de `onlyOwner`.
- Gestão de stablecoins (adicionar/remover).
- Lógica de swap na Uniswap V3, incluindo a busca dinâmica da `feeTier` via The Graph.
- Falhas esperadas, como tentativas de swap com tokens não aprovados.

### Cobertura de Testes
Para gerar um relatório de cobertura de código:
```bash
npx hardhat coverage
```
Isso criará uma pasta `coverage/` com um relatório detalhado em HTML.

### Implantação (Deploy)
Para implantar os contratos no seu fork local do Anvil:
```bash
npx hardhat run scripts/deploy.js --network localhost
```
Este script irá:
1.  Implantar um contrato `Token` de exemplo (ERC-20).
2.  Implantar o contrato `SplitPayment`.
3.  Salvar os endereços dos contratos implantados no arquivo `contract-addresses.json` para fácil acesso por outros scripts.

# 4. Interagindo com o Contrato

Após a implantação, você pode interagir com o contrato usando o script `interact.js` ou o console do Hardhat.

### Usando o Script de Interação
O script `scripts/interact.js` demonstra como usar as funcionalidades do `SplitPayment`, como adicionar uma stablecoin e executar um swap.

Execute o script:
```bash
npx hardhat run scripts/interact.js --network localhost
```
O script usa os endereços do `contract-addresses.json` e executa as seguintes ações:
1.  Adiciona o BRZ como uma stablecoin.
2.  Aprova o contrato `SplitPayment` para gastar o token de teste.
3.  Executa um swap do token de teste para BRZ.
4.  Verifica os saldos antes e depois do swap.

### Usando o Console do Hardhat
Para uma interação mais manual e exploratória:
```bash
npx hardhat console --network localhost
```
Dentro do console, você pode instanciar e chamar as funções do contrato:
```javascript
// Obter o endereço do contrato do arquivo gerado
const addresses = require("./contract-addresses.json");
const splitPaymentAddress = addresses.splitPayment;

// Anexar ao contrato implantado
const SplitPayment = await ethers.getContractFactory("SplitPayment");
const splitPayment = await SplitPayment.attach(splitPaymentAddress);

// Exemplo: verificar a carteira de imposto
await splitPayment.taxWallet();

// Exemplo: verificar se um token é stablecoin
const BRZ_ADDRESS = "0x4fAD614A7b5533E7245b7333513c19b06794348F";
await splitPayment.isStablecoin(BRZ_ADDRESS);
```
# 5. Análise de Segurança com Mythril

Mythril é uma poderosa ferramenta para análise estática e simbólica de segurança. Para usá-la, é recomendado ter um ambiente Python.

### Configuração do Ambiente Python
```bash
# Crie um ambiente virtual (recomendado)
python3 -m venv venv
source venv/bin/activate

# Instale o Mythril
pip install mythril
```

### Executando a Análise
Para analisar o contrato `SplitPayment.sol` e detectar vulnerabilidades comuns, execute:
```bash
myth analyze contracts/SplitPayment.sol --solc-json solc-json.json -o markdown > mythril_analysis.md
```
- `solc-json.json`: Este arquivo mapeia os imports do OpenZeppelin para que o Mythril possa encontrá-los.
- `-o markdown`: Formata a saída em Markdown.
- `> mythil_analysis.md`: Salva o relatório no arquivo `mythil_analysis.md`.

# 6. Estrutura do Projeto

```
piloto/
├── contracts/
│   ├── SplitPayment.sol  # O contrato principal
│   └── Token.sol         # Um contrato ERC-20 de exemplo
├── scripts/
│   ├── deploy.js         # Script para implantar os contratos
│   └── interact.js       # Script para interagir com o contrato implantado
├── test/
│   └── SplitPayment.test.js # Testes para o contrato
├── hardhat.config.js     # Configuração do Hardhat (redes, compilador)
├── contract-addresses.json # Gerado pelo deploy.js com os endereços
├── .env                  # Variáveis de ambiente (não versionado)
└── README.md             # Este arquivo
```
