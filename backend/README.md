# Split Payment - Backend API

Este diretório contém o backend da aplicação Split Payment. É uma API construída com **FastAPI** que serve como uma camada de suporte off-chain para o frontend, otimizando a interação com a blockchain.

## ✨ Visão Geral

A principal responsabilidade desta API é fornecer dados em tempo real que seriam caros ou lentos para obter diretamente on-chain. Suas funções incluem:

-   **Cotações de Swap:** Buscar os melhores pools de liquidez no Uniswap V3 para um determinado par de tokens.
-   **Monitoramento de Pools:** Executar tarefas em segundo plano para monitorar a atividade de pools específicos.
-   **Servir Dados ao Frontend:** Entregar os dados processados de forma rápida e eficiente para a interface do usuário.

## 🛠️ Tecnologias Utilizadas

-   **Python 3.11+**
-   **FastAPI:** Para a construção da API web.
-   **Pydantic:** Para validação e serialização de dados.
-   **The Graph:** Para consultar dados indexados da blockchain (Uniswap V3).
-   **Uvicorn:** Como servidor ASGI para rodar a aplicação.

---

## 🚀 Guia de Instalação e Execução

Siga os passos abaixo para configurar e rodar a API localmente.

### 1. Pré-requisitos

-   Certifique-se de ter o **Python 3.11** ou superior instalado.

### 2. Instale as Dependências

Instale todas as bibliotecas necessárias a partir do arquivo `requirements.txt`.

```bash
pip install -r requirements.txt
```

### 3. **Renomeie o arquivo `.env.example` para `.env` na raiz da pasta `backend/` e defina as suas varíaveis.**

### 4. Execute a Aplicação

Com tudo configurado, inicie o servidor com o Uvicorn.

```bash
python -m uvicorn main:app --reload
ou
uvicorn main:app --host 0.0.0.0 --port 8000
```

-   `--reload`: Faz com que o servidor reinicie automaticamente após qualquer alteração no código.

A API estará disponível em `http://localhost:8000`.

---

## 📚 Endpoints da API

O FastAPI gera automaticamente uma documentação interativa. Após iniciar o servidor, você pode acessá-la em:

-   **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
-   **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

Principais endpoints:

-   `GET /quote`: Retorna a melhor cotação (melhor pool) para um par de tokens.
-   `GET /pools`: Retorna dados sobre os pools de liquidez monitorados.

## 🏛️ Estrutura do Projeto

-   `main.py`: O ponto de entrada da aplicação. Inicializa o FastAPI e inclui os routers.
-   `config.py`: Gerencia as configurações e variáveis de ambiente usando Pydantic.
-   `/routers`: Define os endpoints da API. Mapeia as rotas para as funções de serviço.
-   `/services`: Contém a lógica de negócio principal da aplicação.
-   `/clients`: Gerencia a comunicação com APIs externas (ex: The Graph).
-   `/models`: Define os modelos de dados Pydantic para validação e serialização.
-   `/constants`: Armazena valores constantes, como endereços de tokens.
-   `/utils`: Funções de utilidade geral usadas em todo o projeto.

---

## 🏁 Iniciando o Backend

Para iniciar o backend da aplicação, utilize o seguinte comando:

```bash
python -m uvicorn main:app --reload
```

Este comando executa o servidor Uvicorn, que por sua vez inicia a aplicação FastAPI contida no módulo `main`, na variável `app`. A opção `--reload` faz com que o servidor reinicie automaticamente sempre que uma alteração no código-fonte for detectada, facilitando o desenvolvimento.
