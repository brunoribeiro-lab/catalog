## API Backend DevOBS

[TODO]
 

## 🚀 1. Pré- Requisitos
Antes de iniciar, certifique-se de ter instalado:

- **Docker**
- **Docker Compose**

## 📦 2. Subindo o ambiente Docker
Dentro da raiz do projeto, execute:

```sh
docker compose up -d app
```

## ⚙️ 3. Instalando dependências
Rodar o composer dentro do container:

```sh
docker compose run --rm artisan composer install
```
Gerar a chave da aplicação:

```sh
docker compose run --rm artisan key:generate
```

## 🗄️ 4. Executando as migrations

```sh
docker compose run --rm artisan migrate
```
> Se aparecer "*Nothing to migrate*" é normal caso já tenha sido rodado antes.

## 🔐 5. Instalando e configurando o Laravel Passport
Rodar o comando principal do Passport:

```sh
docker compose run --rm artisan passport:install
```

Esse comando:

- Gera as chaves de criptografia
- Publica configurações
- Copia as migrations
- Pergunta se deseja rodar migrations faltantes
- Pergunta se deseja criar o **Personal Access Client**

### ✔ Criar o Password Grant Client

O comando abaixo **é obrigatório para login via password**:

Ele vai pedir:

1. **Nome do client**: `Password Grant Client`
2. **User provider**: `0`

No final, ele exibirá os valores:
```
Client ID: 019abc87-c8b9-7083-a07e-b0956bf85e17
Client secret: NxPR8rwOtzO5zefG2IR8T2VRnDTvzV2qGdH0xl25
```

## 📄 6. Configurando o .env

Adicione ao seu `.env`:
```sh
PASSPORT_PASSWORD_CLIENT_ID=X
PASSPORT_PASSWORD_CLIENT_SECRET=YYYYYYYYYYYYY
```
> Substituindo pelos valores retornados no comando anterior.