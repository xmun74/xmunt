---
title: 'AWS BE 배포 1편 - EC2 인스턴스 생성 및 연결'
date: '2026-05-07'
description: 'AWS EC2 인스턴스 생성, SSH 접속, Docker 설치까지 백엔드 배포 과정을 설명합니다.'
tags: ['AWS', 'EC2', 'SSH']
---

> #### Free Tier
>
> : 무료 계정 플랜은 6개월 후 또는 크레딧이 소진되는 시점(둘 중 먼저 도래하는 날짜 기준)에 만료
>
> - 가입 시 100 USD의 기본 크레딧이 제공.
> - 5개 서비스 이용시 100 USD의 크레딧이 추가 제공 [(AWS 공식문서 설명)](https://aws.amazon.com/ko/blogs/korea/aws-free-tier-update-new-customers-can-get-started-and-explore-aws-with-up-to-200-in-credits/)
>   - Amazon Elastic Compute Cloud(Amazon EC2)
>   - Amazon Relational Database Service(Amazon RDS)
>   - AWS Lambda
>   - Amazon Bedrock
>   - AWS Budgets
> - [AWS 살펴보기]에서 튜토리얼대로 따라하면 추가 크레딧 획득 가능
>   ![260519-101105](/images/posts/aws-be-deploy/260519-101105.png)

<br/><br/>

# EC2 인스턴스 생성 및 연결

- AWS 무료 계정의 루트 사용자로 로그인 후 - region을 서울로 지정
  ![260507-171520](/images/posts/aws-be-deploy/260507-171520.png)

## 1. 인스턴스 생성하기

### 1-1. 이름 및 태그, OS 선택하기

- EC2 - 인스턴스 시작
- 인스턴스 이름을 입력하고, OS는 우분투를 선택했다.
  ![260508-093913](/images/posts/aws-be-deploy/260508-093913.png)

### 1-2. 인스턴스 유형

프리티어 계정이기 때문에 프리 티어 사용 가능인 유형으로 선택한다.
![260507-172235](/images/posts/aws-be-deploy/260507-172235.png)

### 1-3. 키 페어 생성

- 새 키 페어 생성 누르고
  ![](https://velog.velcdn.com/images/xmun74/post/e0ccc943-9d41-4a78-8fa5-056f3070ca70/image.png)
- 이름을 지정한 후, 유형은 RSA, 형식은 .pem으로 생성
  ![260507-172853](/images/posts/aws-be-deploy/260507-172853.png)
- 생성하면 .pem 파일이 다운로드 받아진다

### 1-4. 네트워크 설정

- `보안 그룹 생성` , `SSH 트래픽 허용`이 기본으로 체크되어 있다
- HTTP 통신을 할 것이므로 `HTTP 트래픽 허용`을 체크해준다.
- HTTP 트래픽 허용을 체크해주고 편집 버튼을 클릭한다.

![260508-084634](/images/posts/aws-be-deploy/260508-084634.png)

- 밑에 HTTP 위치무관으로 보안그룹이 추가된 것을 확인할 수 있다.

![260508-085005](/images/posts/aws-be-deploy/260508-085005.png)

<br/><br/>

#### 1-5. 스토리지 구성

- 기본값이었던 8기가에서 최대 30까지 설정 가능하고, 원하는 크기로 지정한다.
  ![260508-085125](/images/posts/aws-be-deploy/260508-085125.png)

- 설정을 검토한 후 인스턴스 시작 클릭하기
  ![260508-085329](/images/posts/aws-be-deploy/260508-085329.png)

- 인스턴스가 잘 생성되면 바로 인스턴스 연결로 넘어가기
  ![260508-090706](/images/posts/aws-be-deploy/260508-090706.png)

<br/><br/><br/><br/>

## 2. 인스턴스 연결하기 (SSH 클라이언트)

> - SSH (secure shell)
>   네트워크 상 다른 컴포터에 로그인하거나 원격으로 실행해주는 응용 프로그램이다.

#### 2-1. 인스턴스 생성시 다운받은 keypair `.pem` 파일을 `/.ssh` 폴더로 복사하기

- `cp .pem저장경로/파일명.pem ~/.ssh` : 해당 pem파일 경로의 .pem파일을 `/.ssh` 사용자 홈 디렉토리 안에 복사한다는 명령어다.
- (Mac) 파일경로 복사하기 : 파일 선택 후 cmd + option + C
  ```bash
  cp /Users/유저명/Downloads/키생성할때 지은 이름.pem ~/.ssh/
  ```
- ssh 폴더로 이동하기

  ```bash
  cd ~/.ssh
  ```

#### 2-2. 권한 설정 및 연결

![260508-092811](/images/posts/aws-be-deploy/260508-092811.png)

- 권한 설정하기 (첫번째 chmod로 시작한 명령어 복붙)
  `chmod 400 filename` : 읽기 전용(수정 불가). 파일 소유자에게만 읽기 권한 부여하고 그 외 사용자는 어떤 권한도 부여하지 않는다.
  ```bash
  chmod 400 "키이름.pem"
  ```
- 인스턴스 연결 (ssh -i로 시작한 명령어 복붙)
  ```bash
  ssh -i "키이름.pem" ubuntu@해당인스턴스의 퍼블릭DNS주소
  ```
- 터미널에서 yes를 입력해주면 우분투 인스턴스로 연결이 된다.
  ![260508-093436](/images/posts/aws-be-deploy/260508-093436.png)

<br/><br/><br/><br/>

---

# EC2에 Docker 설치 (Docker 필요시)

SSH 접속된 터미널에서 순서대로 실행

    ```bash
    # 패키지 업데이트
    sudo apt-get update

    # Docker 설치
    sudo apt-get install -y docker.io

    # 부팅 시 자동 시작
    sudo systemctl enable docker
    sudo systemctl start docker

    # sudo 없이 docker 명령어 사용 (ubuntu 유저에 docker 그룹 추가)
    sudo usermod -aG docker ubuntu

    # 그룹 적용을 위해 재접속
    exit

    # exit 후 다시 SSH 접속
    ssh -i ~/.ssh/키이름.pem ubuntu@<퍼블릭IP>

    # Docker 정상 설치됐는지 버전 확인
    docker --version
    ```

![](https://velog.velcdn.com/images/xmun74/post/9c0825fd-8ee5-4039-aac1-39ca4ffc927b/image.png)

2. git clone

   ```bash
   git clone https://<username>:<token>@github.com/<username>/<repo이름>.git
   cd repo이름
   ```

3. 환경변수 세팅

   ```bash
   touch .env
   TERM=xterm-256color nano .env
   #  nano가 열리면 실제 값 입력 후 Ctrl+X → Y → Enter로 저장
   ```

4. docker 실행

   ```bash
   # 한번만 실행
   docker build -t repo이름 .

   # 컨테이너 실행
   docker run --rm -p 8000:8000 --env-file .env repo이름
   ```

<br/><br/><br/><br/>
