# ProjetoBDNSQL - Grupo CalmaMente - DSM FATEC VOTORANTIM

API de Clínicas

Descrição
A API de Clínicas é um sistema desenvolvido para tarefa do curso de Bancos de Dados Não Relacionais do curso de Desenvolvimento de Software Multiplataforma da Fatec Votorantim. Ela permite o gerenciamento de informações relacionadas a clínicas que serão implementadas na Plataforma CalmaMente.

Informações Básicas
Certifique-se de adicionar a seguinte chave no arquivo package.json para suportar o uso de módulos ECMAScript:

<json>

{ "type": "module" }


Dicas

Renomeie o arquivo .env-example para .env e forneça a sua string de conexão com o MongoDB.

Instale a pasta node_modules usando o comando: npm i

Execute o servidor localmente, no terminal bash do VSCode, usando: npm run dev

Instale os pacotes usando comando, se necessário:
npm install express mongodb dotenv express-validator cors bcryptjs jsonwebtoken nodemon jest supertest --save-dev


Pacotes Utilizados
express: Framework web rápido e flexível para Node.js.
mongodb: Driver oficial do MongoDB para Node.js.
dotenv: Carrega variáveis de ambiente do arquivo .env para process.env.
cors: Middleware que permite comunicação entre diferentes domínios na web.
express-validator: Middleware para validação de dados de entrada em solicitações HTTP.
nodemon (apenas para desenvolvimento): Ferramenta que monitora alterações no código-fonte e reinicia automaticamente o servidor.
jsonwebtoken: Implementação de JWT em Node.js.
bcryptjs: Algoritmo de geração de hash para senhas.
JestUm-SuperTest Framework de testes JavaScript popular e leve, ideal para testes unitários, de integração e ponta a ponta. SuperTest é uma biblioteca que facilita o teste de APIs Node.js com Jest ou Mocha, fornecendo uma interface de alto nível para realizar requisições HTTP e verificar as respostas.

Acesse em: https://projeto-bdnsql.vercel.app/

Grupo CalmaMente

## 🧪 Testes
Para a execução dos testes, instale os pacotes como dependência apenas de desenvolvimento:
```
npm install jest supertest -D
```

### Função de Cada um dos Pacotes de testes 🧪

| Pacote | Descrição |
|---|---|
| **Jest** | Um framework de testes JavaScript popular e leve para testes unitários, testes de integração e testes de ponta a ponta. |
| **SuperTest** | Uma biblioteca para testar APIs Node.js com o Jest ou Mocha. Ela fornece uma interface de alto nível para realizar requisições HTTP para sua API e verificar as respostas. |

### Outros ajustes nos testes 🧪
* Crie uma pasta chamada ```__tests__``` no raiz do projeto para armazenar todos os testes criados.
* Edite o _package.json_ e informe que o framework a ser utilizado é o jest. Com isso, será possível executar o comando ```npm run test```:
```json
{
  "scripts": {
    "test": "jest"
  }
}
```
## 📃Documentação da API
Para a geração automática da documentação, instale os pacotes a seguir:
```
npm i swagger-ui-express@4.3 
npm i swagger-autogen -D
```
* Crie uma pasta chamada ```swagger``` dentro da pasta ```api``` do projeto para armazenar a configuração do swagger.
* Edite o _package.json_ e informe que utilizaremos o swagger. Com isso, será possível executar o comando ```npm run doc```:
```json
{
  "scripts": {
    "doc": "node swagger.js"
  }
}
```
### Editando o api/index.js

Adicione os novos imports necessários:
```javascript
import fs from 'fs'
import swaggerUI from 'swagger-ui-express'
```

Crie a nova rota para a documentação:
```javascript
/* Rota da documentação Swagger */
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css"

app.use('/api/doc', swaggerUI.serve, swaggerUI.setup(JSON.parse(fs.readFileSync('./api/swagger/swagger_output.json')),{customCss:
      '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl: CSS_URL }))

```

Para testar, aponte o navegador para a url:

https://seusite.com.br/api/doc