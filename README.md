# todo-rest-api-nest-sls

ちょっと前に作ってみようと考案していた構成でToDoリスト用REST API作ってみた。（途中）

- TypeScript
- Nest.js
  - @nestjs/passport
- TypeORM
- Serverless Framework
- API Gateway
- Lambda
- RDS Proxy
- RDS for MySQL

![aws_architecture.png](aws_architecture.png)

## 機能

- [ ] ToDoアイテムの要素
  - [ ] タイトル
  - [ ] 内容
- [ ] 検索
- [ ] 登録
- [ ] 更新
- [ ] 削除
- [ ] ユーザごとにToDo操作可能、認証/認可
- [ ] テストコード
- [ ] API仕様書

## Activity logs

### プロジェクト作成

2020/05/25 19:30-19:50

1. `npx nest new todo-rest-api-nest-serverlessframework`
   1. `npm` 選択
2. `npm i -S aws-lambda aws-serverless-express express`
3. `npm i -D @types/aws-serverless-express serverless-layers`
4. `npm audit fix --force`
5. `src/handler.ts`
6. `serverless.yml`
7. `package.json` : scripts に `deploy:dev` と `deploy:prod` 追加
8. initial commit

### リソース 作成

2020/05/25 19:50-21:00

1. AWS コンソールログイン
2. EIP 作成
3. VPC 作成（VPC ウィザード）
   1. 名前タグ: `dafujii-vpc`
   2. IPv4 CIDR ブロック: `192.168.0.0/16`
4. サブネット作成
   1. 名前タグ: `dafujii-subnet-public-alpha`
      1. AZ: `ap-northeast-1c`
      2. IPv4 CIDR ブロック: `192.168.1.0/24`
   2. 名前タグ: `dafujii-subnet-private-alpha`
      1. AZ: `ap-northeast-1c`
      2. IPv4 CIDR ブロック: `192.168.2.0/24`
   3. 名前タグ: `dafujii-subnet-private-bravo`
      1. AZ: `ap-northeast-1d`
      2. IPv4 CIDR ブロック: `192.168.4.0/24`
5. RDS 作成
   1. パラメータグループ作成
      1. `dafujii-rds-mysql57-parameter-group`
      2. time_zone: `Asia/Tokyo`
   2. サブネットグループ作成
      1. 名前: `dafujii-rds-subnet-group`
      2. `192.168.2.0/24`　と `192.168.4.0/24`
   3. RDS 作成
      1. MySQL 5.7.28
      2. db.t2.micro
      3. `dafujii-rds`
      4. サブネットグループ: `dafujii-rds-subnet-group`
      5. AZ: `ap-northeast-1c`
      6. 最初のデータベース名: `dafujii`
      7. DB パラメータグループ: `dafujii-rds-mysql57-parameter-group`
   4. RDS Proxy 作成
      1. `dafujii-rds-proxy`
      2. Secrets Managerシークレット作成
         1. dafujii/rds/admin

### 疎通確認

2020/05/25 21:00-21:30

1. `npm i -S @nestjs/typeorm typeorm mysql`
2. `app.module.ts` に`TypeOrmModule.forRoot` 記述（RDS Proxy使わず）
3. `npm run deploy:dev`
4. `serverless.yml` 編集
   1. VPC Lambda 
5. `npm run deploy:dev`
6. 500 Internal Server Error ＼(^o^)／ｵﾜﾀ

### ローカル開発、認証周りしよう

2020/05/26 20:00-21:30

1. 小さな修正コミットいくつか
2. Lambda にデプロイしなくても、`npm run start:dev` でローカルで立ち上がることを思い出す😇
   1. とりあえずは SQLiteでいいよね
3. `ormconfig.json` 作成
4. `npm i -S sqlite3`
5. DBのめどがついたことにして、次は認証周りを作る
   1. auth ブランチ作成
   2. 公式サイト見ながらほぼ写経
      1. `npm i -S @nestjs/passport passport passport-local`
      2. `npm i -D @types/passport-local`
      3. `nest g module auth`
      4. `nest g service auth`
      5. `nest g module users`
      6. `nest g service users`
      7. 後でTypeORMで永続化する必要がある
      8. `npm i -S @nestjs/jwt passport-jwt`
      9. `npm i -D @types/passport-jwt`
      10. ユーザ認証テスト。JWT 初体験
      11. `auth/constants.ts` バージョン管理したらアカンやつや😇
6.  GitHubに空リポジトリ作る

#### ユーザ認証テスト

```http
POST http://localhost:3000/auth/login HTTP/1.1
Content-Type: application/json

{
  "username":"alpha",
  "password":"123456789"
}

###

GET http://localhost:3000/profile HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsIaaacaaaaaaaaaaa.eyJ1c2VybmFtZSI6ImxxxGhhIiwic3ViIjoxLCJpYXQxxx1OxxxxTQ5MzYsImV4cCI6MTxxxDQ5NDk5Nn0.a613xxxlwndD9kMRoK4xxUfyv7R3uBKPakdt7xxVsAA
```

### 現状をpushするための準備

2020/05/27 19:30-21:00

1. `README.md` 編集
2. draw.ioでアーキテクチャ構成図（理想）作成
3. `serverless-offline` 使えばローカルでも機密情報がSSMや環境変数で何とかなるんじゃないか説
   1. `serverless.yml` : `AUTH_SECRET: ${ssm:/dafujii/todo-rest-api-nest-sls/AUTH_SECRET}`
   2. `aws ssm put-parameter --name "/dafujii/todo-rest-api-nest-sls/AUTH_SECRET" --description "jwtConstants.secret"  --type "String" --value "{secret key}"`
   3. `npm install -D serverless serverless-offline`
   4. `.vscode/launch.json`
   5. `src/auth/constants.ts` : `secret: process.env.AUTH_SECRET`
   6. `npm run build`
   7. デバッグ実行成功ス
   8. 検証成功
4. コミットできる目途がついたのでコミット(auth)
5. masterにマージしてpush
   1. `git remote add origin git@github.com:dafujii/todo-rest-api-nest-sls.git`
   2. `git push -u origin master`

## 課題

- [ ] どうやってRDSにつなぐ？
  - [ ] SQLiteでもいいか！
- [ ] デプロイ時のマイグレーションどうする？
- [x] secretの管理方法
  - [x] https://qiita.com/takasp/items/60b201607cec57d55596
- [ ] 永続化
- [ ] デプロイ方法は？
  - [ ] CodeDeploy
  - [ ] `auth/constants.ts` 差し替え
  - [ ] TypeORMのマイグレーションコマンド？
  - [ ] `deploy:dev`
- [ ] パスワードハッシュ化

## わかったこと

- VPCウィザードから「パブリックとプライベートサブネットを持つVPC」を作ったらNATゲートウェイも作られる
- RDS作成時に設定可能パスワード上限文字数は41文字
- RDS作成時にAZ選べた（前は選べなかったよね？）
- RDS Proxy作成画面から「新しいシークレットを作成する」をしても作成画面内に更新ボタンがないので一旦キャンセルする必要がある
- デプロイ時にServerless Framework はプロジェクト名をプレフィックスとしてIAMロールを作るが、64文字超えても何もしないので長すぎるとデプロイに失敗する
  - `todo-rest-api-nest-serverlessframework-dev-ap-northeast-1-lambdaRole` で69文字
- Nest.jsで認証周りはpassportというものがある
- JWTのふいんき。名前とJSONを渡して認証するくらいのざっくり感しか知らなかったけど軽く動きが分かった
- `serverless.yml` で `: ${ssm:/path/}` とすればSSMから値と取って設定してくれる
- 以前書いた自分のnote見れば問題が解決できる状況はありがたい。よくやった。
- nest.js + Serverless Frameworkでも `serverless-offline` 動いてくれる
  - ローカルでもSSMから値を取って来てくれる
  - ただし自動 `dist/` に出力したものを動かすため主導でビルドする必要がある
  - ブレイクポイント打てるのはcontrollerのみ？

## わからん

- RDS Proxy繋がらん原因わからん
  - 多分セキュリティグループ
- nest.jsわからん
  - passportわからん
- TypeORMわからん
- nest.js + Serverless Framework
  - `serverless-offline`
    - 毎回手動でビルドコマンド叩く必要がある？
    - 初回実行時はHTTP 502返す？

## 参考記事

- Nest.js + Serverless Framework + TypeScript で API Gateway + Lambda 環境を構築してみる
  - https://note.com/dafujii/n/n83e76bc7e008
- Nest.js公式ドキュメント
  - https://docs.nestjs.com/techniques/database
  - https://docs.nestjs.com/techniques/authentication
- NestJSのススメ ～Expressを超えてゆけ～
  - https://qiita.com/elipmoc101/items/9b1e6b3efa62f3c2a166
- Serverless Framework から AWS Systems Manager パラメータストアを利用する
  - https://qiita.com/takasp/items/60b201607cec57d55596
- serverless-offline を導入して  Serverless Framework + TypeScript で作った Lambda 関数を VS Code でステップ実行する
  - https://note.com/dafujii/n/naf05740a253b

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
