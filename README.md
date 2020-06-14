# todo-rest-api-nest-sls

ちょっと前に作ってみようと考案していた構成でToDoリスト用REST API作ってみた。（途中）

- TypeScript
- Nest.js
  - @nestjs/passport
  - @nestjs/swagger
- TypeORM
- Serverless Framework
- Jest
- API Gateway
- Lambda
- RDS Proxy
- RDS for MySQL
- Systems Manager Parameter Store
- CodePipeline + CodeBuild

![./docs/aws_architecture.png](./docs/aws_architecture.png)

![./docs/ER.png](./docs/ER.png)

## 機能

- ToDoアイテムの要素
  - タイトル
  - 内容
  - ステータス
- [x] 検索
  - [x] タイトル
  - [x] 内容
  - [ ] ステータス
- [x] 登録
- [x] 更新
- [x] 削除
- [x] ユーザごとにToDo操作可能、認証/認可
- [x] テストコード
- [ ] API仕様書

## How to use

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Activity Log

[Activity Log](./docs/ActivityLog.md)
