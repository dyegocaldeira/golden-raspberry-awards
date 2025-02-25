# Golden Raspberry Awards - NestJS

Esta é uma aplicação desenvolvida em [NestJS](https://nestjs.com/) utilizando um banco de dados SQLite em memória. Nenhuma instalação externa é necessária além das dependências da aplicação.

## Requisitos

- [Docker](https://www.docker.com/) instalado na máquina (caso deseje rodar a aplicação em container)
- [Node.js 22.14.0](https://nodejs.org/) (caso deseje rodar a aplicação localmente sem Docker)

## Estrutura de Diretórios

- O arquivo com os dados a serem importados (CSV) deve estar no diretório `src/data` com o nome `movielist.csv` (`src/data/movielist.csv`).
- Os testes E2E utilizam uma cópia do arquivo de dados para testes, localizado em `tests/data/__e2e__.csv`. **Este arquivo não deve ser substituído, pois os testes dependem dele**.
- Por padrão, o delimitador das colunas do CSV é `;`. Caso precise usar `,`, basta passar a seguinte variável de ambiente: `CSV_SEPARATOR=","`.

---

## Executando a Aplicação com Docker

1. Clone o repositório:

   ```sh
   git clone https://github.com/dyegocaldeira/golden-raspberry-awards.git
   ```

2. Entre no diretório da aplicação:

   ```sh
   cd golden-raspberry-awards
   ```

3. Construa e rode o container:

   ```sh
   docker build -t golden-raspberry-awards . && docker run -p 3000:3000 golden-raspberry-awards
   ```

   A aplicação subirá como em ambiente de produção.

### Executando Testes E2E com Docker

1. Construa e rode o container de testes:
   ```sh
   docker build -t golden-raspberry-awards-e2e -f Dockerfile-e2e . && docker run golden-raspberry-awards-e2e
   ```

---

## Executando a Aplicação com Docker Compose

1. Para iniciar a aplicação em ambiente de produção:

   ```sh
   docker compose up
   ```

2. Para executar os testes E2E:

   ```sh
   docker compose -f docker-compose-e2e.yml up
   ```

---

## Executando a Aplicação Localmente (Sem Docker)

1. Certifique-se de ter o Node.js 22.14.0 instalado.
2. Entre no diretório da aplicação:
   ```sh
   cd golden-raspberry-awards
   ```
3. Instale as dependências:
   ```sh
   npm ci
   ```

### Executando a Aplicação

- **Modo Produção**

  ```sh
  npm run build
  npm run start:prod
  ```

- **Modo Desenvolvimento**

  ```sh
  npm run start:dev
  ```

- **Executando os Testes E2E**

  ```sh
  npm run test:e2e
  ```

---

## Endpoints e Swagger

Após iniciar a aplicação, ela ficará disponível em:

- API: [http://localhost:3000/api](http://localhost:3000/api)
- Swagger UI: [http://localhost:3000/swagger](http://localhost:3000/swagger)

