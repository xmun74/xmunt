---
title: 'AWS BE 배포 2편 - EC2에 HTTPS 적용하기 (Route53 · ACM · ALB)'
date: '2026-05-08'
description: '가비아 도메인 구매부터 Route53, ACM 인증서 발급, ALB 리스너 구성까지 EC2에 HTTPS를 적용하는 전체 과정입니다.'
tags: ['AWS', 'EC2', 'HTTPS', 'Route53', 'ACM', 'ALB']
---

> ### EC2에 HTTPS 적용하는 과정
>
> 1. 도메인 구매 (가비아)
> 2. Route53에 도메인 등록하기
> 3. ACM(AWS Certificate Manager)에서 SSL/TLS 인증서 발급받기
> 4. 로드 밸런서 설정 - EC2 인스턴스 앞에 ALB 배치 후 ALB에 인증서 설치
>
> #### 추가 작업
>
> - EC2와 ALB 보안 그룹 설정
> - DNS 업데이트

<br/><br/><br/><br/>

# 1. 도메인 구매 (가비아)

인증서 적용하기 위해 실제 도메인 구매

<br/>

> 도메인을 구입할 때 'www'가 붙지 않은 기본 도메인(예: `example.com`)을 구입하면 된다. 이렇게 하면 해당 도메인의 서브도메인(예: `www.example.com`, `api.example.com` 등)을 자유롭게 설정하여 사용할 수 있다.

<br/>

- 가비아 접속 https://www.gabia.com/
- 소유자 정보 입력, 인증 후 - 기본 설정 그대로 함.
  ![](https://velog.velcdn.com/images/xmun74/post/3e3f74cc-4cd3-4f6c-b5d3-a6b0f792de10/image.png)

<br/><br/><br/><br/>

---

# 2. Route53

: DNS 서비스.
도메인을 구매하고 호스팅 영역을 생성 및 NS네임서버 구축하여 DNS에 요청할 수 있다.

### 2-1. Route53 호스트 영역 생성

- Route53 - 호스팅 영역 - 호스팅 영역 생성
  ![260508-125628](/images/posts/aws-be-deploy2/260508-125628.png)
- 구매한 도메인 입력 후 - 호스팅 영역 생성
  ![260508-125454](/images/posts/aws-be-deploy2/260508-125454.png)
- NS 유형 값 4개가 생성되는데 이를 복사해 가비아 네임서버에 설정해야한다
  ![](https://velog.velcdn.com/images/xmun74/post/47192327-2080-4f44-b846-fcaf02b5789b/image.png)

### 2-2. 가비아 네임서버(NS) 설정

My 가비아 - 이용중인 서비스에서 도메인 클릭 - 해당 도메인의 관리 클릭

- 네임서버 설정 클릭
  ![](https://velog.velcdn.com/images/xmun74/post/7e5cb80d-e9c0-439b-8bec-d9b5adaa1573/image.png)
- Route53에서 방금 생성된 NS유형 4개를 복사해서 1,2,3,4차에 작성하기
  - 붙여넣기할 때 마지막 점 `.`은 제외하고 작성하기
- `소유자 인증` 후 `적용` 클릭하면 끝
  ![](https://velog.velcdn.com/images/xmun74/post/3ec0852e-cc5a-4293-84aa-f886fa69e513/image.png)

<br/><br/><br/><br/>

---

# 3. ACM(AWS Certificate Manager) 인증서 요청하기

## 3-1. 서울 리전 선택 - 인증서 요청

이번엔 로드밸런서로 사용할 것이기 때문에 리전 서울로 선택하기
![260508-104953](/images/posts/aws-be-deploy2/260508-104953.png)

## 3-2. 인증서 유형 - 기본 선택 그대로

![260508-105018](/images/posts/aws-be-deploy2/260508-105018.png)

## 3-3. 도메인 이름

- `도메인` 추가
- `*.도메인` 추가

![260508-105237](/images/posts/aws-be-deploy2/260508-105237.png)

- 이하 기본설정 그대로 두고 - 요청

- 인증서 ID 클릭
  ![](https://velog.velcdn.com/images/xmun74/post/133a1b99-0c05-4006-ac51-ed592477f3bd/image.png)
- Route53에서 레코드 생성 -> 레코드 생성 클릭
  ![260508-105330](/images/posts/aws-be-deploy2/260508-105330.png)

<br/><br/><br/><br/>

---

# 4. EC2 보안그룹 추가

- EC2 인스턴스 - 보안탭 - 보안그룹 클릭 - 인바운드 규칙 편집
- HTTPS 유형, 443 포트, Anywhere-IPv4 추가하기
- TCP 유형, 80 포트(서버 포트번호) -> 는 이전에 지정해뒀었음
  ![](https://velog.velcdn.com/images/xmun74/post/66f75268-e9a5-4d2c-b9fc-82b20261f74d/image.png)

---

# 5. 로드 밸런서 설정

> Load Balancer : 요청을 여러 서버로 분산하는 서비스

## 5-1. 대상 그룹(Target Group) 생성

- EC2 좌측 메뉴 하단 - 로드 밸런싱 - 대상 그룹 - 대상 그룹 생성
  ![](https://velog.velcdn.com/images/xmun74/post/4496152f-64cb-4e15-b1be-8357e27e83a6/image.png)
- 대상 유형 - 인스턴스
  ![260508-113906](/images/posts/aws-be-deploy2/260508-113906.png)
- 대상 그룹 이름 - 이름 입력 후
- 프로토콜 - 서버 포트번호 8000 사용한다면 80말고 `8000` 입력하기!
- Health checks
  정상 동작하는 지 테스트하는 것으로,
  프로토콜 선택하고 path는 실제 서비스에서 응답 보내는 api를 작성하면 됨
- 이하 밑 옵션은 기본 설정 그대로 두고 다음 클릭
  ![260508-111329](/images/posts/aws-be-deploy2/260508-111329.png)
- 인스턴스 ID 체크 - 아래에 보류 중인 것으로 포함 클릭 - 대상 그룹 생성
  ![260508-111436](/images/posts/aws-be-deploy2/260508-111436.png)

## 5-2. 로드 밸런서 생성

- EC2 왼쪽 메뉴 탭 - 로드 밸런싱 - 로드밸런서 - 로드밸런서 생성
  ![](https://velog.velcdn.com/images/xmun74/post/c62b2f8e-515e-4cf5-a640-6658ce9d2aa8/image.png)

#### 1. 기본구성

- 로드 밸런서 이름 작성
  ![260508-111647](/images/posts/aws-be-deploy2/260508-111647.png)

#### 2. 네트워크 매핑 : 최소 2개 선택해야 함

- 인스턴스 네트워킹 탭 - 가용 영역에서 마지막 부분 확인 후 해당되는 영역으로 추가
- `~2a`랑 `~2c` 체크함
  ![260508-111746](/images/posts/aws-be-deploy2/260508-111746.png)

#### 3. 보안그룹

- ec2 인스턴스와 같은 보안그룹으로 선택 (설정안했다면 default)
  ![](https://velog.velcdn.com/images/xmun74/post/f3ddf917-af1c-4d8e-b655-ceef3edf6f96/image.png)

#### 4. 리스너 및 라우팅

- HTTPS 443 - 위에서 만든 대상그룹 선택
- 리스너 추가 - HTTP 8000 - 위에서 만든 대상그룹 선택
  ![260508-112811](/images/posts/aws-be-deploy2/260508-112811.png)

#### 5. 보안 리스너 설정

기본 SSL/TLS 서버 인증서 - ACM에서 - 위에서 만든 인증서 선택
![260508-113032](/images/posts/aws-be-deploy2/260508-113032.png)

- 로드 밸런서 생성 클릭 - 로드 밸런서 보기
- 상태가 프로비저닝 -> 활성화 바뀌면
  ![260508-113304](/images/posts/aws-be-deploy2/260508-113304.png)
  ![260508-113311](/images/posts/aws-be-deploy2/260508-113311.png)

<br/><br/>

## 5-3. Route53 레코드 추가

- Route53 - 호스팅 영역 - 레코드 생성
  ![260508-104342](/images/posts/aws-be-deploy2/260508-104342.png)
- 백엔드 서브도메인을 `api.도메인`으로 사용할 것이기 때문에
  - 레코드명 `api` 입력
  - 레코드유형 - A 선택
  - 별칭 체크
    - Application/Classic Load Balancer에 대한 별칭 선택
    - 서울 리전 선택
    - 위에서 생성한 로드밸런서 선택
  - 대상 상태 평가 비활성화
    ![260508-110220](/images/posts/aws-be-deploy2/260508-110220.png)

## 5-4. 로드 밸런서 리스너 편집하기

- 80 포트 리스너 규칙 편집하기
  : HTTP 80(서버)으로 요청이 오면 HTTPS 443으로 리디렉션 해줘야 한다.

- 로드밸런서 - 80 포트 선택 / 리스너 관리 - 리스너 편집
  ![260508-110622](/images/posts/aws-be-deploy2/260508-110622.png)
  리스너 편집
- URL로 리디렉션 / URI 부분 / HTTPS 선택 / 443 입력
  ![260508-110823](/images/posts/aws-be-deploy2/260508-110823.png)

---

# 테스트하기

- `http://도메인`으로 요청오면 `https://도메인`로 바로 리디렉션 함(443 포트는 생략 가능하다)
- 예시
  `http://api.도메인/bible?book=1&chapter=2` 요청 전송하면
  `https://api.도메인/bible?book=1&chapter=2`로 리디렉션 함

---

<br/><br/><br/><br/>

참고

- [[AWS]인증서 없이 HTTP 웹사이트를 HTTPS로 바꾸는 2가지 방법 - AWS 강의실 유튜브](https://www.youtube.com/watch?v=WS2n8mkrFaY)

<br/><br/><br/><br/>
