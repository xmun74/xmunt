---
title: 'Github Actions - 프론트엔드 CI/CD 구축하기 (S3, CloudFront)'
description: 'Github Actions로 프론트엔드 코드 빌드하고 AWS S3, CloudFront 배포 자동화하기'
coverImage: ''
image: ''
date: '2023-09-28'
path: 'github-actions-fe-01'
category: 'CI/CD'
tags:
  - Github Actions
  - CI/CD
---

# IAM

IAM(Identity and Access Management)
: 외부에서 AWS 리소스에 대한 액세스 권한을 안전하게 제어하는 서비스

- 예시
  - Github Actions에서 S3에 접근할 때.
  - NodeJS에서 S3에 이미지 업로드하기 위해서 S3에 접근할 때

---

# 1. IAM 사용자 생성하기

Github Actions에서 S3에 업로드하고 CloudFront의 캐시를 무효화하기 위해서 IAM 사용자를 사용하여 접근해보겠습니다.

- IAM - 사용자 메뉴 - 사용자 생성
  ![](https://velog.velcdn.com/images/xmun74/post/af81dce3-b0ba-4ff2-978e-cd90feebb2de/image.png)
- 사용자 이름 입력
  ![](https://velog.velcdn.com/images/xmun74/post/3bce27ab-0ad6-4784-90bb-580d58ff895b/image.png)
- 직접 정책 연결 체크 후
  `AmazonS3FullAccess`와 `CloudFrontFullAccess` 체크.
  Github Actions에서 S3와 CloudFront에 접근할 것이기에 위에 2개를 체크해줬다.
  ![](https://velog.velcdn.com/images/xmun74/post/a5748d37-d2d8-4374-aaba-8a8b10a0bf21/image.png)
  ![](https://velog.velcdn.com/images/xmun74/post/948ecdfd-49dc-4905-9a2d-9525edc5d41e/image.png)
- 검토 후 사용자 생성
  ![](https://velog.velcdn.com/images/xmun74/post/62162fb4-96b0-49fd-999c-d7d2342b9cf5/image.png)
- 생성된 사용자 이름 클릭
  ![](https://velog.velcdn.com/images/xmun74/post/a322554a-2a01-4be6-935b-3ebbee72a87c/image.png)
- 보안 자격 증명 탭 - 액세스 키 만들기
  : 외부에서 사용할 수 있게 액세스 키를 생성한다.
  ![](https://velog.velcdn.com/images/xmun74/post/71f79d3d-c8d2-4e4b-8ab7-20a30f36f060/image.png)
- 사용 사례 - 서드 파티 (깃헙 등)
  ![](https://velog.velcdn.com/images/xmun74/post/65c2955f-aa20-4a12-96b8-2e4ea98a4b8d/image.png)
- 설명 태그 설정 - 설정하고 - 액세스 키 만들기
  ![](https://velog.velcdn.com/images/xmun74/post/40ebafd2-3611-418f-aa58-6326643e4fcf/image.png)
- 액세스 키 생성됨
  🚨 이 페이지에서 바로 나가지 말고 깃헙 secrets에 등록하기
  페이지를 나가면 다시 액세스 키를 보거나 다운받을 수 없습니다!
  이 키는 절대 외부로 유출하면 안되기 때문에 Github Secret에 등록하여 깃헙에 올라가지 않게 합니다.
  ![](https://velog.velcdn.com/images/xmun74/post/456d57cd-92aa-4f84-9165-8dd045e13aa1/image.png)
- ✅[필수] 깃헙 레포 - Settings > Actions > New ~ secret 해서 등록하기
  ![](https://velog.velcdn.com/images/xmun74/post/f767e337-a5ab-4469-b491-b7318aa063a3/image.png)

---

# 2. Github Actions CI/CD 작성

#### jobs 진행 과정

1. NodeJS 세팅
2. yarn install
3. build 하기
4. AWS 인증 정보 설정
5. AWS S3에 배포하기
6. [AWS CloudFront 캐시 무효화](https://docs.aws.amazon.com/ko_kr/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html)

```yml
name: CI-CD-biblical-web

on:
  push:
    branches:
      - master
    paths:
      - 'apps/web/**'

jobs:
  test:
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

      - name: ⎔ Monorepo install
        uses: ./.github/actions/yarn-install

      - name: ⎔ Build web
        working-directory: apps/web
        env:
          API_URL: ${{ secrets.API_URL}}
          USER_IMG_FIELD: ${{ secrets.USER_IMG_FIELD}}
          CLIENT_URL: ${{ secrets.CLIENT_URL}}
        run: |
          yarn build

      - name: ⎔ Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_KEY }}
          aws-region: ap-northeast-2

      - name: ⎔ Deploy to AWS S3
        run: |
          aws s3 sync --delete --region ap-northeast-2 apps/web/dist s3://S3버킷명

      - name: ⎔ Invalidate AWS CloudFront Cache
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.AWS_DISTRIBUTION_ID }} --paths "/*"
```

#### AWS S3에 배포하기

`aws s3 sync --delete --region ap-northeast-2 apps/web/dist s3://버킷명`

- sync : S3 버킷과 로컬폴더 간 동기화하기
- --delete : 로컬에서 삭제된 파일은 S3 버킷에서도 삭제된다
- --region ap-northeast-2 : 리전을 서울로 지정
- apps/web/dist : 빌드폴더 경로
  <br />

#### AWS CloudFront 캐시 무효화

`aws cloudfront create-invalidation --distribution-id ${{ secrets.AWS_DISTRIBUTION_ID }} --paths "/*"`

- --paths "/\*" : 모든 파일에 대한 캐시 무효화
- 캐시 무효화하는 이유
  : CloudFront의 캐시 정책을 `CachingOptimized`로 선택한 경우,
  캐시 유지시간이 기본 TTL 24시간으로 설정되어 있다. 따라서 S3 버킷을 재업로드 후 변경된 사항을 배포된 cloudfront에서 바로 확인하고 싶다면 캐시 무효화를 해줘야 한다.
- 참고로 캐시 객체 무효화는 매월 1000개 경로까지 무료이고 그 이상부터 경로당 0.005 USD 비용이 발생한다. ([CloudFront 비용](https://aws.amazon.com/ko/cloudfront/pricing/))

<br /><br /><br /><br /><br />
