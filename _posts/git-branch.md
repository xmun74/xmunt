---
title: 'Git 브랜치 전략'
description: 'Git Flow, Github Flow, TBD, GitLab Flow'
coverImage: '/images/posts/git-branch/241027-221924.png'
image: ''
date: '2024-10-27'
path: 'git-branch'
category: ''
tags:
  - branch
---

# Git Flow

깃 플로우는 2010년도 Vincent Driessen이 제안한 전략이다. 브랜치 전략을 검색하면 나오는 유명한 도식도도 밑 포스팅 하단 링크에 들어가면 확인할 수 있다.

- [A successful Git branching model - Vincent Driessen이 제안한 브랜치 전략(2010년)](https://nvie.com/posts/a-successful-git-branching-model/)

![241027-221924](/images/posts/git-branch/241027-221924.png)

위 그림에 정의된 브랜치를 나열하면 밑처럼 구성되어 있다.

1. `master(main)` : 배포된 프로덕션 브랜치
2. `develop` : 다음 버전 개발 완료 후 main 브랜치로 머지
3. features(`feature/branch-name`) : 기능 개발 후 develop 브랜치로 머지
4. releases(`release/v1.1`)
   : develop 브랜치에서 따와서 bugfix나 수정을 하고 배포 준비 테스트를 마치면 main, develop 브랜치에 머지
5. hotfixes(`hotfix/v1.1`)
   : 배포 후 문제 발생 시 main에서 가져와서 문제해결 후 main, develop 브랜치에 머지

<br />

#### 💁 누가 사용하는 것이 적합한가요?

1. 안정적으로 관리 가능한 장기간의 릴리스 주기를 가진 팀
2. 병렬적으로 다중 버전관리가 필요한 `앱, 라이브러리/프레임워크` 등에 적합할 수 있다.
   - 이유
   - **앱**을 사용자가 업데이트 안할 수도 있기 때문에 이전 버전도 지원해야 함
   - **라이브러리/프레임워크**들은 특정 버전으로 설치가 가능함.
     예) `npm -D react@^16.8.0 react-dom@16.8.0`

> ### 웹 개발자들은 Git Flow가 복잡해요 🤯
>
> `웹 어플리케이션 개발자들은 ...`

- 하루에 **여러 번 배포**하기도 하는데
  복잡한 git flow는 작업 속도를 늦추고, 다양한 브랜치를 관리하는데 복잡도가 증가한다는 단점이 있습니다. 이는 빠른 개발 사이클과 안맞기 때문입니다.
- 병렬적으로 다중 버전관리가 아닌, **가장 최신의 단일 버전만을 관리**하면 되기 때문입니다.
  이에 대한 내용은 Vincent Driessen님의 [글 상단](https://nvie.com/posts/a-successful-git-branching-model/) **"반성문"**이라는 코멘트에서 확인할 수 있다.
  ![241027-221940](/images/posts/git-branch/241027-221940.png)

---

<br /><br />

# [GitHub Flow](https://githubflow.github.io/)

: main 브랜치와 함께 기능 브랜치로는 feature를 사용하는 전략

1. `master(main)` : 배포되는 브랜치
2. `features` : 기능 브랜치

- 바로 밑에서 소개하는 TBD와 유사하지만, 차이점을 말해보자면 밑과 같은 내용이 있다.
- GitHub에서의 브랜치는 장기간의 기능 브랜치라는 점에서 차이가 있다.
- GitHub Flow는 기능이 완료된 이후에 머지 수행하지만, TBD는 하루에도 여러번 병합을 수행한다.
- GitHub Flow는 기능 개발 주기가 긴 반면, TBD는 빠르면서 점진적인 개발 주기를 가져간다.

<br /><br /><br /><br />

---

# [Trunk-based Development(TBD)](https://trunkbaseddevelopment.com/)

: 모든 개발자가 `trunk(or main)` 단일 브랜치를 항상 배포 가능한 상태로 유지하는 방식.

- 각 개발자들은 신규 기능을 바로 main에 작은 단위로 commit한다.
- 브랜치를 사용하려면 작은 단위의 짧은 수명을 가진 feature 브랜치를 사용한다.
- 빠른 릴리스가 가능
- [Google](https://cloud.google.com/architecture/devops?hl=ko), Facebook 등 대규모 연속 배포, 고속 릴리스를 안정적으로 수행하는 대규모 서비스에서 사용하는 방식.

> trunk(나무 줄기:주요코드)라는 명칭과 branch(나뭇가지:기능,변경사항)를 비유로 사용.

![241027-221952](/images/posts/git-branch/241027-221952.png)

#### 특징

1. 짧은 수명(sort-lived)의 기능 브랜치
   : 머지 지옥(충돌해결 문제)을 되도록 피하기 위해서 장기간의 브랜치를 사용하지 않는다. commit의 단위를 작게 가져가거나, 브랜치의 기간을 짧게 가져간다.
2. 빠른 코드 리뷰, 페어 프로그래밍
   : main에 바로 commit 해야되기 때문에 코드의 안정성과 품질이 보장되어야한다. 그래서 이를 위해서 페어 프로그래밍이나 코드리뷰 등의 과정이 필요하다.
   페어 프로그래밍을 하면서 자연스럽게 코드 내용에 대해서 공유, 오류 검출 등의 작업을 하거나 아니면 빠른 코드리뷰를 통해서라도 코드 품질을 높이는 작업을 수행한다.
3. 자동화 테스트 구축
   : 마찬가지로 코드 안정성과 품질을 보장하기 위한 테스트 과정이 필요하다. 테스트를 통과했을 때 머지가 되도록 자동화 테스트가 구축되어야 한다.
4. 소규모 CI/CD 자동화
5. 큰 기능 개발의 경우는 Feature Toggles 사용
   : 큰 단위의 신규 기능이어서 장기간 작업이 이뤄질 경우에 main에 푸시할 경우, 해당 기능은 아직 운영에 보이지 않게 비활성화해야하는 경우가 있다. 이런 경우는 아직 작업 진행중인 기능을 비활성화한 상태로 병합할 수 있도록 Feature Toggle를 사용한다. 또는 브랜치 추상화([Branch by abstraction](https://trunkbaseddevelopment.com/branch-by-abstraction/))를 활용한다.

<br />

#### [Feature Toggles(Feature Flags)](https://martinfowler.com/articles/feature-toggles.html)란?

- 특정 기능을 배포 이후 비활성화 또는 활성화해서 토글할 수 있음.
- 특정 기능을 특정 유저에게만 운영환경에서 테스트 가능하게 활성화할 수 있음.

---

<br /><br />

## GitLab Flow

: GitLab을 활용하여 Merge, CI/CD와 연관되고 다양한 환경에서의 배포에 초점이 맞춰진 전략 - [GitLab 참고](https://about.gitlab.com/blog/2023/07/27/gitlab-flow-duo/)

1. `master(main)`
   : feature가 완료되어 pr을 받고 production에 나가는 브랜치(이전 develop과 동일)
2. `feature` : master에서 파생되고 머지
3. `pre-production`
   : master와 production 사이의 단계로 테스트 서버에 배포해서 테스트하는 브랜치
4. `production` : 배포 브랜치

---

<br /><br /><br /><br />

# 참고

- https://trunkbaseddevelopment.com/
- [A successful Git branching model - Vincent Driessen](https://nvie.com/posts/a-successful-git-branching-model/)
