---
title: 'Github Actions - 백엔드 CI/CD 구축하기'
description: 'Github Actions로 백엔드 코드 빌드와 AWS 배포 자동화하기'
coverImage: ''
image: ''
date: '2023-09-25'
path: 'github-actions-be-01'
category: 'CI/CD'
tags:
  - Github Actions
  - CI/CD
---

## 도입 배경

#### [문제] 프리티어 EC2 인스턴스에서 서버 빌드가 너무 오래 걸린다.

![](https://velog.velcdn.com/images/xmun74/post/62f62e8b-b94b-4c90-b403-c76f1bca95f3/image.png)
nodeJS, express, Typescript로 백엔드를 만들어서 인스턴스 내에서 빌드하는 과정이 있었습니다. 그런데 EC2 인스턴스에서 `yarn tsc` 빌드 명령어를 수행하면 30분 이상 그냥 저대로 멈춰있었습니다.
계속 저 상태로 놔두면 인스턴스 상태검사(연결성 검사)에서 통과되지 않는 상황으로 바뀌기도 했습니다. 상태검사가 통과가 안되는 상태로 바뀌면 EC2 인스턴스 콘솔과 SSH 클라이언트에서 접속이 불가해지는 문제로 이어졌습니다. 그래서 상태검사를 통과시키기 위해 인스턴스 중지했다가 다시 시작해야 했습니다.

#### [원인] 프리티어 t2.micro 인스턴스 메모리 부족

프리티어로 사용중이던 t2.micro 인스턴스는 1G 메모리밖에 안돼서 서버 빌드가 중단되거나 오래 걸린다고 합니다. 인스턴스 유형을 바꾸고 돈을 더 내면 간단한 문제지만, 개인 프로젝트였기 때문에 프리티어 계정을 사용하여 무료로 이용해야 한다는 제한을 두고 진행해야했습니다.

#### [해결 방법]

1. [스왑 파일로 디스크의 RAM을 임시 메모리로 끌어와 사용하는 것](https://repost.aws/ko/knowledge-center/ec2-memory-swap-file)
   단점
   - 스왑 공간은 디스크에 위치하기 때문에 RAM에 비해 느린 HDD을 사용하게 되어 I/O 속도가 느려져서 서버 성능이 저하될 수 있음
2. 인스턴스 외 환경에서 빌드, 배포하기 (CI/CD)

1번 방법은 서버 성능 저하와 메모리 관리 복잡성이 증가한다는 단점이 존재하기때문에 현재 상황에서는 2번인 인스턴스 외 환경에서 빌드/배포하는 방법을 선택했습니다.
원래는 CI/CD를 빌드/배포 자동화의 도구라고만 생각했었는데 위 배경처럼 메모리가 부족한 문제 상황에서 해결 방법으로 선택할 수 있음을 다시 배울 수 있었습니다.
<br /><br />
CI/CD로는 Github Actions, 젠킨스 등이 있습니다. Github Actions는 무료 계정으로 현재 월 2000분, 500MB까지 무료로 사용할 수 있다고 합니다. ([GitHub Actions 청구 정보](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions#included-storage-and-minutes))
그래서 Github Actions를 사용해서 구축해보았습니다.

<br /><br /><br /><br />

---

<br />

# Github Action 흐름

> Github에 PUSH(트리거) - Build - Test - Deploy

제 NodeJS 백엔드는 Test가 없기 때문에 일단 크게 Build와 Deploy의 흐름으로 작성했습니다.
시작하기에 앞서 루트에 `.github/workflows` 폴더 생성 후 `파일명.yml`파일을 생성합니다.

#### 진행 과정

1. Github 특정 브랜치에 Push하면
2. 빌드한 다음 빌드된 결과물을 압축
3. 압축된 빌드 결과물을 EC2 인스턴스에 전송
4. 배포 과정을 담은 sell script 실행

## 1. Github 특정 브랜치에 PUSH하면

```yml
name: CI-CD-server

on:
  push:
    branches:
      - master
```

- `on` : `jobs`이 실행될 상황 정의.
  master 브랜치에 push할 때 jobs를 실행하게 했습니다.

## 2. 빌드한 다음 빌드된 결과물을 압축

```yml
jobs:
  build-and-deploy-server:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x]
    steps:
      - uses: actions/checkout@v3

      - name: ⎔ Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: ⎔ Install packages
        run: yarn
```

- `jobs` - 실행될 작업 내용을 작성.

1. `actions/checkout@v3`
   Runner(workflow 실행환경)가 현재 Github 저장소 소스코드에 체크아웃됩니다.
2. ⎔ Use Node.js ${{ matrix.node-version }}
   인스턴스와 동일한 node 버전(18.x)으로 적용합니다.
3. ⎔ Install packages
   yarn 명령어로 패키지들 설치합니다.

```yml
	  - name: ⎔ Build server
        env:
          COOKIE_SECRET: ${{ secrets.COOKIE_SECRET}}
          MYSQL_USERNAME: ${{ secrets.MYSQL_USERNAME}}
          MYSQL_PWD: ${{ secrets.MYSQL_PWD}}
          MYSQL_HOST: ${{ secrets.MYSQL_HOST}}
          PORT: ${{ secrets.PORT}}
          KAKAO_ID: ${{ secrets.KAKAO_ID}}
          FRONTEND_URL: ${{ secrets.FRONTEND_URL}}
          REDIS_HOST: ${{ secrets.REDIS_HOST}}
          REDIS_PORT: ${{ secrets.REDIS_PORT}}
          REDIS_PWD: ${{ secrets.REDIS_PWD}}
        run: |
          yarn build

      - name: ⎔ Package dist Folder
        run: tar -czvf dist.tar.gz dist
```

4. ⎔ Build server
   env 환경변수들을 가져오고 빌드하기
5. ⎔ Package dist Folder
   빌드한 dist 폴더를 tar 파일로 압축하기

## 3. 압축된 빌드 결과물을 EC2 인스턴스에 전송

```yml
- name: ⎔ Deploy to Amazon ECS
  uses: appleboy/scp-action@master
  with:
    host: ${{ secrets.EC2_IP }}
    username: ${{ secrets.EC2_USER }}
    key: ${{ secrets.EC2_PEM_KEY }}
    source: 'dist.tar.gz'
    target: ${{ secrets.SERVER_PATH }}
```

#### [appleboy/scp-action@master](https://github.com/appleboy/scp-action)

: GitHub Actions에서 사용되는 SCP(Secure Copy Protocol)를 이용한 파일 전송 액션입니다. 이는 workflow가 실행된 후에 생성된 파일들을 다른 서버로 안전하게 복사하는 데 사용합니다.

- 액션에 전달할 값 (유출하면 안됨)
  - host: EC2 퍼블릿 IP 주소
  - username: EC2 인스턴스 접속위한 사용자명
  - key: 인스턴스 생성할 때 다운받은 pem key
  - source: 복사할 파일. 빌드폴더를 압축한 파일을 적었습니다.
  - target: 복사한 파일이 전송될 서버 내 경로.

#### Github에 secrets 등록하기

1. GitHub 레포에서 Settings > Secrets > `New repository secret` 클릭
2. `Name` 필드에 지정할 이름(예:EC2_KEY)을 입력하고,
   `Value` 필드에 복사한 키 내용을 붙여넣기
3. `Add secret` 클릭하여 저장

#### pem 파일 로컬에서 여는 방법

1. 로컬 터미널에서 해당 pem파일이 위치하는 폴더로 가서
2. `cat 파일명.pem` 입력
3. (-----BEGIN RSA PRIVATE KEY----- 로 시작하여 -----END RSA PRIVATE KEY----- 로 끝나는 부분) 전체를 복사
4. GitHub Secrets에 등록하기

## 4. 배포 과정을 담은 sell script 실행

```yml
- name: ⎔ Execute shell script
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.EC2_IP }}
    username: ${{ secrets.EC2_USER }}
    key: ${{ secrets.EC2_PEM_KEY }}
    script: |
      cd ${{ secrets.SERVER_PATH }}
      sudo tar -xzvf dist.tar.gz
      git pull origin 브랜치명
      yarn
      pm2 kill
      pm2 start dist/index.js
```

#### [appleboy/ssh-action@master](https://github.com/appleboy/ssh-action)

: SSH(Secure Shell: 원격 컴퓨터를 안전하게 제어하고 전송하기 위한 프로토콜)를 통해 원격 서버에 접속하여 명령어를 실행하는 액션.

- host, username, key는 scp와 똑같이 입력했습니다.
- script
  평소 코드를 push하고 인스턴스에서 반복 작업하던 명령어들을 script에 작성합니다. 여기서 위에서 압축했던 파일을 압축해제하는 코드를 추가합니다.
  ```bash
  cd 프로젝트폴더
  sudo tar -xzvf dist.tar.gz  #빌드폴더 파일압축 해제
  git pull origin 브랜치명
  yarn
  pm2 kill  #실행중이던 pm2 종료
  pm2 start dist/index.js   #pm2 실행하기
  ```

---

## 전체 코드

```yml
name: CI-CD-server

on:
  push:
    branches:
      - master

jobs:
  build-and-deploy-server:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x]
    steps:
      - uses: actions/checkout@v3

      - name: ⎔ Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: ⎔ Install packages
        run: yarn

      - name: ⎔ Build server
        env:
          COOKIE_SECRET: ${{ secrets.COOKIE_SECRET}}
          MYSQL_USERNAME: ${{ secrets.MYSQL_USERNAME}}
          MYSQL_PWD: ${{ secrets.MYSQL_PWD}}
          MYSQL_HOST: ${{ secrets.MYSQL_HOST}}
          PORT: ${{ secrets.PORT}}
          KAKAO_ID: ${{ secrets.KAKAO_ID}}
          FRONTEND_URL: ${{ secrets.FRONTEND_URL}}
          REDIS_HOST: ${{ secrets.REDIS_HOST}}
          REDIS_PORT: ${{ secrets.REDIS_PORT}}
          REDIS_PWD: ${{ secrets.REDIS_PWD}}
        run: |
          yarn build

      - name: ⎔ Package dist Folder
        run: tar -czvf dist.tar.gz dist

      - name: ⎔ Deploy to Amazon ECS
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.EC2_IP }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_PEM_KEY }}
          source: 'dist.tar.gz'
          target: ${{ secrets.SERVER_PATH }}

      - name: ⎔ Execute shell script
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_IP }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_PEM_KEY }}
          script: |
            cd ${{ secrets.SERVER_PATH }}
            sudo tar -xzvf dist.tar.gz
            git pull origin 브랜치명
            yarn
            pm2 kill
            pm2 start dist/index.js
```

- Github에 push 후, CI/CD가 잘 작동하는 것을 확인할 수 있었습니다.
  ![](https://velog.velcdn.com/images/xmun74/post/660cd926-c776-4ef7-8081-ee4cc8557032/image.png)

<br /><br />

---

<br /><br /><br /><br /><br />

참고

- [zero-black 벨로그 - [github-actions] 리액트 빌드하기](https://velog.io/@zero-black/github-actions-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%B9%8C%EB%93%9C%ED%95%98%EA%B8%B0)
- [oscar0421 벨로그 -[github action] 빌드부터 배포까지!](https://velog.io/@oscar0421/github-action-%EB%B9%8C%EB%93%9C%EB%B6%80%ED%84%B0-%EB%B0%B0%ED%8F%AC%EA%B9%8C%EC%A7%80#workflow-%EC%9E%91%EC%84%B1%ED%95%98%EA%B8%B0)
