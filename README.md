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