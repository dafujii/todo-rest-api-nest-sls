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

![./docs/aws_architecture.png](./docs/aws_architecture.png)

![./docs/ER.png](./docs/ER.png)

## 機能

- ToDoアイテムの要素
  - タイトル
  - 内容
  - ステータス
- [x] 検索
- [x] 登録
- [x] 更新
- [x] 削除
- [x] ユーザごとにToDo操作可能、認証/認可
- [x] テストコード
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

### 自動生成されたテストを通るようにする

2020/06/03 13:20 - 13:50

`auth.service.spec.ts` と `app.controller.spec.ts` でテスト失敗中

1. `Test.createTestingModule` で色々読み込ませる必要がある説
   1. `app.controller.spec.ts` のテストが通るように修正、コミット
   1. `auth.service.spec.ts` のテストが通るように修正、コミット

### Nest.jsではDTOを使うらしいのでログイン周りの処理に持ち込んでみる

2020/06/03 14:10 - 14:30

1. `login-user.dto.ts`
2. `nest g interface users/interface/user`
3. `Guard` で処理された結果が `@Request` に入って来てるので、DTOに置き換えられなさそう？
   1. DTO削除
4. `User` を `IUser` に置き換えてコミット

### テストに慣れるためにログイン時のテストを書いてみる

2020/06/03 14:40 - 15:30

1. `auth.service.spec.ts`
   1. `validateUser` のテスト作成
   2. コミット
      1. ちょいちょいコミット漏れ出てくる…🤔
2. `app.controller.spec.ts`
   1. ログイン時のテスト作成
   2. `profile` のテスト作成
   3. コミット

### ER図つくる

2020/06/03 19:50 - 20:10

1. draw.ioで製図
2. ドキュメント整備
3. コミット

### TypeORMとUsersテーブルと

2020/06/03 20:15 - 21:30

1. `./entities/user.entity.ts`
2. `IUser`から`User`へ置き換え
3. 😇
4. `@Column({type: 'enum'}` はSQLite対応してなかった
5. TODO: テスト全部失敗するのでなんとかする

### テスト用DBモック

2020/06/04 20:20 - 20:50

1. `getRepositoryToken()` を使えばいいらしい
   1. `usevalue` でメソッド定義できる！
2. 各テスト書き換え
   1. 昨日作った`user.entity.ts`の中身が`User`と`ToDo`悪魔合体してた🤔
3. テスト成功！
4. コミット

### リファクタリング

2020/06/06 13:30 - 13:50

1. 未使用変数削除
2. any撲滅
3. `username`をユニークに
4. コミット

### パスワードハッシュ使用

2020/06/06 13:50 - 14:10

1. bcryptがデファクトスタンダードみたい
   1. `npm i -S bcrypt`
   2. `npm i -D @types/bcrypt`
2. 認証処理修正
3. コミット

### ユーザ新規登録対応！

2020/06/06 14:20 - 15:50

1. `users/dto/create-user.dto.ts`
2. `nest g co users`
3. `getProfile()`を`UsersController`へ
4. テスト修正
5. ユーザ登録
   1. `users.service.ts`
   2. `users.controller.ts`
   3. `users.service.spec.ts`
      1. `findOne()`のテスト
      2. `create()`のテスト
   4. `users.controller.spec.ts`
      1. `create()`のテスト
6. テストのダブりがひどい😇
7. REST Clientでテストも成功！
8. コミット！

### 本体のToDo部分作成！一覧取得！

2020/06/06 19:40 - 21:30

1. `./entities/todo.entity.ts`
   1. 1対多
   2. テスト修正
2. `nest g module todos`
3. `nest g service todos`
4. `nest g controller todos`
5. まずはユーザごとToDo一覧
   1. Service
      1. `findAllByUser()`
      2. テスト書く
         1. `Array.find()`と`Array.filter()`間違えていた😇
   2. Controller
      1. `GET /todos/lists` で一覧返すようにする
      2. テスト書く
6. コミット！
7. 実際にリクエスト飛ばして確認したら依存解決できずダメだった😇
8. 修正して確認してコミット！

### ToDo登録機能！

2020/06/07 14:00 - 14:35

1. `todos.service.ts`
   1. `create()`
   2. テスト書く
2. `dto/create-todo.dto.ts`
3. `todos.controller.ts`
   1. `POST /todos/` で登録させる！
   2. `create()`
   3. テスト書く
4. テスト書いても`serverless-offline`で実際に動作確認しないと信頼できない状況改善したい
   1. 登録確認💪
5. SQLiteの中身を確認したらテーブル名が思ってたんと違う😇
   1. `user` / `to_do`
6. とりあえずコミット

### ToDo削除機能！

2020/06/07 15:10 - 16:10

1. `todos.service.ts`
   1. `delete()`
   2. テスト書く
2. `todos.controller.ts`
   1. `DELETE /todos/{id}`に決めた！
   2. `delete()`
      1. 何返すもんなん？
         1. 返さんとこ！
      2. テスト書く
         1. 例外のテストの書き方はまった
3. 実際の動作確認も完了👍

### ID指定して単一ToDo取得をTDDでやってみようの巻

2020/06/07 17:00 - 17:10

1. Service
   1. テスト書く。失敗
   2. `findById()`実装
   3. テスト成功！
2. Controller
   1. テスト書く。失敗
   2. `findById()`実装
   3. テスト成功！
   4. 存在しない場合のテスト書く。失敗
   5. `findById()`改修
   6. テスト成功！
3. 実際に動作確認
4. コミット

### ToDo更新

2020/06/07 17:10 - 17:35

1. Service
   1. テスト書いて失敗させる
   2. `update()`実装
      1. `update-todo.dto.ts`作成
   3. テスト成功
2. Controller
   1. テスト書いて失敗させる
   2. `update()`実装
      1. `PATCH todos/{id}`になるよね
   3. テスト成功
3. 実際に動作確認完了
4. コミット

### ToDo検索

2020/06/07 20:15 - 21:30

1. テキストの検索だけでいいよね
2. 検索結果0件の場合でも200でいいんだよね？　404は意味が変わるし
3. Service
   1. まずテスト書いて失敗させる
      1. モックで複数の`find()`を良い感じにしてやる方法がわからん
   2. `search()`実装
   3. とりあえずテストは通った
4. Controller
   1. `GET /todos/search/{text}`でええんやろか
   2. テスト書いて失敗
   3. `search()`実装
   4. テスト通った
5. 実際に確認
6. コミット

### Nest.jsはOpenAPIの定義の出力できるらしいのでやってみよう

2020/06/10 19:25 - 22:20

1. 公式ドキュメントの通りやってみる
   1. `npm install --save @nestjs/swagger swagger-ui-express`
   2. `main.ts`
      1. 本番環境でも動いてしまう？
         1. Lambdaではエントリポイントはhandlerになるからセーフ！
   3. `npm run start`
   4. `/api` でControllerから読み取られて既に定義が作られていることを確認！すごい
      1. エントリポイントが環境ごとに`/dev`や`/prod`となるのどうしよう？
   5. DTOの各プロパティに`@ApiProperty()`デコレータを使えば定義に現れる
      1. ログインはDTO使ってないからDTOつくって、メソッドには`@ApiBody()`デコレータ
   6. ログイン必須操作には`@ApiHeader()`デコレータを使う
   7. レスポンスは`@ApiResponse()`
      1. `@ApiNotFoundResponse()`などもある
         1. `type:HttpException`にしても定義に現れない……
            1. 仕方なくOpenAPI用クラスを作成
               1. `openapi/HttpStatus.openapi.ts`
      2. エンティティにも`@ApiProperty()`で定義に現れる
         1. Date型はそのまま読み取ってくれる
2. `main.ts`に`.setBasePath('dev')`追加して`npm run start`でもLambda同等のパスルーティングを実現！
3. 他のユーザのToDo操作できるやんけ！
   1. 修正！
4. `nest start`と`serverless offline`の動作で挙動が違う……？
5. 一旦コミット

### TypeORMが自動生成するテーブルをきれいにしたい

2020/06/11 16:00 - 17:00

1. テーブル名指定できた
   1. `users`/`todos`
2. コード上では`created_at`/`updated_at`を`createdAt`/`updatedAt`になるようにもできる
3. リレーションの張り方修正
4. テスト修正
5. 挙動の違い判明！
6. コミット

### 環境ごとにDB接続先を変えたい（開発環境）

2020/06/11 20:10 - 21:10

1. 環境は以下のように分けたい
   - `local`: SQLite
   - `test`: SQLite
   - `dev`: RDS for MySQL
   - `prod`: RDS for MySQL
2. `dev`/`prod`の接続情報はSSMから読み取ることになりそう
3. まずは`local`/`test`でDB分けるようにする
   1. `ormconfig.json`から`ormconfig.js`に変更
   2. DB定義
   3. `npm i -D cross-env`
   4. `package.json`のscripts変更
   5. E2Eテストで`test`が動作するか確認
      1. テストは通らないけど`test`が使われていること確認😅
4. `dist/`をLambdaに上げるからルートに置いてる`ormconfig.js`が役立たずになる件
   1. `ormconfig.js`を`./src/db.config.ts`に変更
   2. おそらく`entities`や`migrations`もパス変わるよね
   3. E2Eテスト動くようになった
5. `local`/`test`で分けることには成功
6. コミット

## 課題

- [ ] どうやってRDSにつなぐ？
  - [ ] SQLiteでもいいか！
- [ ] デプロイ時のマイグレーションどうする？
  - [ ] `"synchronize": true`で自動化可能だが本番でやるものか？
- [ ] 永続化
- [ ] デプロイ方法は？
  - [ ] CodeBuild
  - [ ] TypeORMのマイグレーションコマンド？
  - [ ] `deploy:dev`
- [x] パスワードハッシュ化
- [ ] テスト
  - [x] DBモック
    - [ ] リポジトリ毎のモックを統一
  - [ ] E2Eテスト
- [x] ユーザの登録
- [ ] レスポンス
  - [ ] 例外処理
  - [ ] `create()`: 201
- [ ] バリデーション
- [ ] API定義書を生成して公開する方法
- [ ] CI/CD
  - [ ] GitHub Actions
  - [ ] CodePipeline

## わかったこと

- VPCウィザードから「パブリックとプライベートサブネットを持つVPC」を作ったらNATゲートウェイも作られる
- RDS作成時に設定可能パスワード上限文字数は41文字
- RDS作成時にAZ選べた（前は選べなかったよね？）
- RDS Proxy作成画面から「新しいシークレットを作成する」をしても作成画面内に更新ボタンがないので一旦キャンセルする必要がある
- デプロイ時にServerless Framework はプロジェクト名をプレフィックスとしてIAMロールを作るが、64文字超えても何もしないので長すぎるとデプロイに失敗する
  - `todo-rest-api-nest-serverlessframework-dev-ap-northeast-1-lambdaRole` で69文字
  - 書いた。[Serverless Framework はプロジェクト名が長すぎるとデプロイに失敗する](https://note.com/dafujii/n/n811f00608c88)
- Nest.jsで認証周りはpassportというものがある
- JWTのふいんき。名前とJSONを渡して認証するくらいのざっくり感しか知らなかったけど軽く動きが分かった
- `serverless.yml` で `: ${ssm:/path/}` とすればSSMから値と取って設定してくれる
- 以前書いた自分のnote見れば問題が解決できる状況はありがたい。よくやった。
- nest.js + Serverless Frameworkでも `serverless-offline` 動いてくれる
  - ローカルでもSSMから値を取って来てくれる
  - ただし自動 `dist/` に出力したものを動かすため主導でビルドする必要がある
  - ブレイクポイント打てるのはcontrollerのみ？
- VSCodeのTest UI Explorerすごい。watchもしてくれる
- IntelliSenseによる自動importでは`./src/`から始まるが、そうするとインポートできない模様
- Nest.jsはscriptsにformatやlintも用意してあってすごくありがたい
- `@Req` は `@Request` のエイリアス、 `@Res` は `@Response` のエイリアス
- Jestはカバレッジとれる
- プロジェクト生成時にテストも生成されていると、テストの書き方が推測できるのでありがたい
- コントローラのテスト書くときはGuardを通ってきた体で書く
  - なのでコントローラで認証/認可失敗時の単体テストは書けない？
- ER図の書き方大分忘れてる
  - 1対多の0以上/1以上とか
- Nest.jsにエンティティの生成コマンドはない
- エンティティに `type:enum` 使える
  - ただしSQLiteは対応していない
- `synchronize:true` でマイグレーションを自動でしてくれる
- `getRepositoryToken()` すごい
  - 任意の文字列を返すように定義したメソッドをDIできる
  - その代わりTypeORMに任せていることがテストできない
- 戻り値の型を`string|undefined` にしなくても`string`だけでいいということ
- bcryptというハッシュ化関数がある
- `@CreateDateColumn()`/`@UpdateDateColumn()`は`NOT NULL` になる
- いくら単体テストかいてもE2Eテストしたらテスト範囲外の部分でエラーが出る……
- 例外テスト書くときはラップする
- 非同期の例外テスト書くときは`rejects`をはさむ
- Jestで一致しないときは`not()`を使う
- `spyOn()`で呼び出しを監視できる
- `main.ts`に`app.setGlobalPrefix('dev');`と記述しておけば`npm run start`でLambdaで動かしたときと同じパスルーティングが実現できる
- `@nestjs/swagger`すごい
  - Union型は列挙型として展開してくれない
- デコレータまみれ。`@nestjs/swagger`はもう使うことないかも
- `nest start`と`serverless offline`の動作で挙動が違う
  - `nest start`で起動した際は、POST時に`Content-Type: application/json`つけないと500エラー返すっぽい
- E2Eテストは`ts-jest`で動かしているのでTypeScriptコードを参照させる

## わからん

- RDS Proxy繋がらん原因わからん
  - 多分セキュリティグループ
- nest.jsわからん
  - passportわからん
    - 新規登録後にログイン状態にする方法
    - 今の実装がセキュリティ的に安全かわからん
  - ドキュメント生成
    - https://docs.nestjs.com/recipes/documentation
    - https://docs.nestjs.com/recipes/swagger
      - もっとスマートにできないものか
  - モックの共通化
    - モックの`find()`を良い感じにする方法
- TypeORMわからん
  - マイグレーションの実運用周り
- nest.js + Serverless Framework
  - `serverless-offline`
    - 毎回手動でビルドコマンド叩く必要がある？
    - 初回実行時はHTTP 502返す？
- ほぼ初めて触るフレームワークやORMでTDDやる方法
- `Controller`から呼び出される`Service`内のメソッドは`Controller`のテストだけでOK？
- `Controller`/`Service`/`Module`の単数形・複数形といった命名規則。todo? todos?
- `@typescript-eslint/camelcase`でいちいち怒られるのつらい
- `Controller`から`Service`への値受け渡しもDTO使っていいもん？
- RESTful API設計わからん
  - レスポンスボディ何返すもんなん？
- 検索クエリ全角文字あったらURLエンコードされて来るの？

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
- TypeORM
  - https://typeorm.io/
- NestJS の TypeORM モジュールを利用したクリーンなデータストアアクセスの実装
  - https://qiita.com/potato4d/items/64a1f518abdfe281ce01
- Nest.jsは素晴らしい
  - https://qiita.com/kmatae/items/5aacc8375f71105ce0e4
- 【待望リリース！】もう Lambda×RDS は怖くない！LambdaでRDSプロキシを徹底的に検証してみた 〜全てがサーバレスになる〜
  - https://qiita.com/G-awa/items/b9138cc1c9e4867a905e

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
