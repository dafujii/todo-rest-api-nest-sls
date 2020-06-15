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

## Sample

https://6remhwzjw2.execute-api.ap-northeast-1.amazonaws.com/dev

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
  - [x] 単体テスト
    - [x] カバレッジ
  - [ ] E2Eテスト
- [x] API仕様書
  - http://localhost:3000/api/
  - [ ] ファイル出力

## How to use

### Local

Using sqlite3.

#### Installation

```bash
npm install
```

#### Running the app

- http://localhost:3000/dev/
- OpenAPI: http://localhost:3000/api/

```bash
npm run start

# watch
npm run start:dev

# debug
npm run start:debug

# serverless-offline
npm run build && serverless offline
```

### Test

```bash
# unit tests
npm run test

# unit tests (watch)
npm run test:watch

# unit tests (debug)
npm run test:debug

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

### Other

```bash
# format
npm run format

# lint
npm run lint
```

## Dev(AWS)

### Prepare

#### AWS Resource

- VPC
  - Subnet
  - Security Group
- RDS
  - (RDS Proxy)
- CodePipeline
- CodeBuild(VPC)
- S3

##### Systems Manager パラメータストア

以下を設定する。

|Key|Comment|
|---|---|
|`/dafujii/todo-rest-api-nest-sls/AUTH_SECRET`|JWT用のシークレットとなる適当な文字列|
|`/dafujii/todo-rest-api-nest-sls/dev/DB_HOST`|接続先DBホスト名|
|`/dafujii/todo-rest-api-nest-sls/dev/DB_USERNAME`|接続先DBユーザ名|
|`/dafujii/todo-rest-api-nest-sls/dev/DB_PASSWORD`|接続先DBパスワード|
|`/dafujii/todo-rest-api-nest-sls/dev/DB_DATABASE`|接続先DBデータベース名|

#### Edit serverless.yml

`vpc`や`deploymentBucket`の項目を自身が用意したリソースに置き換える。

## Activity Log

[Activity Log](./docs/ActivityLog.md)
