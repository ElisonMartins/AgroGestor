# AgroGestor - Documentação do Projeto

## Descrição do Projeto

Este projeto tem como objetivo solucionar a necessidade de gerenciamento eficiente de produtos agrícolas em uma banca de feira itinerante. A aplicação móvel foi desenvolvida para permitir:

- **Cadastro de Produtos**: Inserção de informações como nome, preço, quantidade e imagem de produtos agrícolas.
- **Manipulação do Carrinho de Compras**: Inclusão e remoção de produtos para facilitar o processo de venda.
- **Registro de Vendas**: Armazenamento de informações sobre as vendas realizadas, incluindo a localização.
- **Acompanhamento por Localização**: Visualização das vendas em um mapa interativo, permitindo identificar os locais com maior volume de vendas e planejar estratégias.

A solução visa atender feirantes e agricultores que buscam um sistema simples, eficiente e acessível para organizar suas vendas, com funcionalidades pensadas para o público-alvo, como acessibilidade e suporte para redes sociais.

---

## Passo a Passo para Rodar o Sistema

### Configuração do Backend

#### Pré-requisitos

- **Node.js e npm**: Certifique-se de que o Node.js está instalado. Verifique com os comandos:

  ```bash
  node -v
  npm -v
  ```

  Caso não esteja instalado, baixe e instale a partir do site [Node.js](https://nodejs.org/).

- **Docker**: Para rodar o banco de dados PostgreSQL em um container Docker, instale o Docker em sua máquina. Veja o [guia de instalação](https://docs.docker.com/get-docker/).

- **.env do Backend**: Configure o arquivo `.env` no diretório do backend com as seguintes variáveis:

  ```env
  # Configuração do Banco de Dados
  DATABASE_URL="postgresql://{SEU_USUARIO}:{SUA_SENHA}@localhost:{PORTA_DO_POSTGRES}/{NOME_DO_BANCO}?schema=public"

  # Configuração do AWS S3
  AWS_ACCESS_KEY_ID=sua_access_key_do_bucket
  AWS_SECRET_ACCESS_KEY=sua_secret_access_key_do_bucket
  AWS_REGION=regiao_do_seu_bucket
  S3_BUCKET_NAME=nome_do_bucket
  ```

  - Substitua `{SEU_USUARIO}`, `{SUA_SENHA}`, `{PORTA_DO_POSTGRES}` e `{NOME_DO_BANCO}` com os detalhes do PostgreSQL.
  - Configure `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY` com as credenciais do bucket do S3.

#### Configuração do Docker para o Banco de Dados

No diretório do backend, existe um arquivo `docker-compose.yml`. Inicie o banco de dados com o comando:

```bash
docker-compose up -d
```

Verifique se o container está rodando:

```bash
docker ps
```

#### Instalação de Dependências

Navegue até o diretório do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

#### Configuração do Prisma

Gere os artefatos do Prisma:

```bash
npx prisma generate
```

Aplique as migrações no banco de dados:

```bash
npx prisma migrate dev
```

#### Iniciar o Servidor

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3001`.

---

### Configuração do Frontend

#### Pré-requisitos

- **Expo CLI**: Instale o Expo CLI globalmente:

  ```bash
  npm install -g expo-cli
  ```

- **Node.js e npm**: Certifique-se de que o Node.js está instalado (verifique no backend).

- **.env do Frontend**: Configure o arquivo `.env` no diretório do frontend com a seguinte variável:

  ```env
  API_URL=http://{SEU_IP_LOCAL}:3001
  ```

  - Substitua `{SEU_IP_LOCAL}` pelo IP da máquina onde o backend está rodando. Você pode obter o IP local executando:

    ```bash
    ipconfig # Para Windows
    ifconfig # Para Linux/Mac
    ```

#### Instalação de Dependências

Navegue até o diretório do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

#### Iniciar o Frontend

Inicie o Expo:

```bash
npx expo start
```

Leia o QR Code gerado no terminal com o aplicativo **Expo Go** no seu celular para visualizar o app.

---

## Estrutura de Pastas

### Backend

- `controllers`: Contém os controladores responsáveis por lidar com as requisições e respostas da API.
- `repositories`: Contém as funções que interagem diretamente com o banco de dados.
- `routes`: Define as rotas da aplicação.
- `services`: Contém serviços auxiliares, como configuração do Prisma e do S3.
- `validations`: Validações para entradas de dados utilizando **yup**.

### Frontend

- `app`: Contém as páginas principais do aplicativo.
- `components`: Componentes reutilizáveis, como o cabeçalho e botões da tab bar.
- `styles`: Estilos globais utilizando Tailwind CSS.
- `types`: Tipos utilizados no projeto.

---

## Configuração do Bucket no AWS S3

1. Acesse o console da AWS.
2. Navegue para o serviço **S3** e clique em **Criar Bucket**.
3. Configure:
   - **Nome do bucket**: `agrogestor` (ou outro da sua preferência).
   - **Região**: `sa-east-1` (ou outra da sua preferência).
4. Permissões:
   - Desative o **Bloqueio de Acesso Público** se necessário.
5. Salve as chaves de acesso (Access Key ID e Secret Access Key) no `.env` do backend.

---

## Possíveis Atualizações Futuras

1. **Cadastro e Login de Usuários**
   - Autenticação JWT: Implementar autenticação JWT para garantir sessões seguras e compatíveis com o backend.
   - Login com Redes Sociais:
     - **Google**: Facilitar o acesso com contas do Google.
     - **Facebook**: Priorizar o login com Facebook, ideal para o público-alvo.

2. **Acessibilidade**
   - Idosos e Deficientes Visuais:
     - Modo de alto contraste e ajuste de tamanho de fonte.
     - Compatibilidade com leitores de tela.
     - Gestos simplificados para facilitar a navegação.

3. **Integração com APIs do Google**
   - Usar APIs de Mapas e Autocomplete para:
     - Mapas detalhados e autocomplete de endereços.
     - Melhorar a precisão de localização.
   - **Quando implementar**: Apenas se houver orçamento disponível.

4. **Expansão do Bucket S3**
   - Migrar para um bucket maior quando necessário.
   - Usar políticas de ciclo de vida para excluir ou arquivar imagens antigas, reduzindo custos.

Essas melhorias visam tornar o sistema mais acessível, escalável e amigável ao público-alvo.
