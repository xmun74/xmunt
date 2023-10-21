---
title: 'Module Federation이란?'
description: 'MFE를 위해 사용하는 방식 중 하나인 Module Federation이 무엇인지 알아보도록 합니다.'
coverImage: ''
image: ''
date: '2023-10-18'
path: 'module-federation-01'
category: 'MFE'
tags:
  - 'Module Federation'
  - 'Micro FrontEnd'
---

## 들어가며

모듈 페더레이션이라는 키워드가 왜 등장했는지 그 배경을 잠시 알아보겠습니다. 먼저 모듈 페더레이션은 결국 MFE 마이크로 프론트엔드를 구현하기 위한 방식들 중 하나입니다. 그러기에 앞서 MFE가 무엇인지 간단하게 살펴보겠습니다.
<br />

## MFE(Micro-Frontend) 등장

ThoughtWorks Technology Radar(기술 트렌드 조사 사이트)를 살펴보면 대략 2016년도부터 '마이크로 프론트엔드' 아키텍쳐에 대한 개념이 알려지기 시작하면서 이 아키텍쳐를 적용하려는 시도가 늘어났습니다.
이 개념이 발전하게된 과정을 살펴보면,
먼저 기존에 사용했던 `모놀리식`(한 패키지 안 여러 개의 서비스) 아키텍쳐의 단점으로 서비스 확장의 어려움, 서비스 별 배포가 어려움, 긴 빌드시간 등에 대한 해결책으로 `마이크로서비스` 아키텍쳐가 등장했는데 이 원칙을 프론트엔드 진영에 적용한 것이 `MFE(Micro-Frontend)`입니다.
<br />

물론 무조건 마이크로서비스 아키텍쳐가 정답이라는 말은 아닙니다. [마이크로서비스 한계점에 대한 글](https://news.hada.io/topic?id=7839)을 참고하여 서비스 규모나 비용과 생산성 간 트레이드오프 등을 따져보며, 정말 우리 서비스에 맞는지 검토한 후에 도입하는 것이 적절합니다.
<br />

MFE를 간단히 설명하자면 한 패키지에 묶여있던 거대한 서비스를 마이크로 서비스로 쪼개서 `독립적으로 배포`하고, 쪼개진 서비스를 `통합`할 수 있어야 한다. 예를 들면 밑처럼 모노레포를 사용하여 카드추천, 비대면 계좌개설, 부동산 등의 서비스로 쪼개는 것을 살펴볼 수 있습니다.

- [자료 참고](https://speakerdeck.com/raon0211/toseuyi-maikeuropeuronteuendeu-akitegceo-geurigo-jadonghwa?slide=37)
  ![](https://velog.velcdn.com/images/xmun74/post/ab6b86fe-51d9-4bc2-8652-d8840b19222a/image.png)
  <br />

그렇다면 밑의 그림처럼 분리된 여러 개의 서비스들이 독립적인 CI/CD를 진행하고 하나의 웹 페이지로 조립해야하는 통합 과정이 필요합니다.

- [그림 참고](https://martinfowler.com/articles/micro-frontends.html)
  ![](https://velog.velcdn.com/images/xmun74/post/ecd52c29-6fe2-4d06-87a6-61f18a60ca93/image.png)

<br /><br />

## 통합 방식

[마틴 파울러 사이트의 글](https://martinfowler.com/articles/micro-frontends.html#IntegrationApproaches)에서 소개된 방식들을 간단히 살펴보겠습니다. 방식에 대한 자세한 내용은 해당 글을 참고하시고, 이 외에도 여러 방식이 존재합니다. 나눠진 코드 조각들을 하나로 통합하는 방식들입니다.
그 중 JavaScript를 통한 런타임 통합 방식으로 Moduel Federation이 있습니다.

1. 서버 측 템플릿 구성
2. 빌드 타임 통합
3. iframe을 통한 런타임 통합
4. JavaScript를 통한 런타임 통합
   - 직접 구현하기
   - Sigle-SPA 라이브러리
   - Module Federation
5. 웹 컴포넌트를 통한 런타임 통합

위 방식 중에서 JavaScript를 통한 런타임 통합으로 Module Federation에 대한 구현은 밑과 같은 방식들이 있습니다.

- Webpack5의 [ModuleFederationPlugin](https://webpack.kr/plugins/module-federation-plugin/)
  : Webpack5부터 내장된 모듈 페더레이션 플러그인입니다.
- [vite-plugin-federation](https://github.com/originjs/vite-plugin-federation)
  : 모듈 페더레이션을 지원하는 Vite/Rollup 플러그인으로, Webpack에서 영감을 받았고 Webpack Module Federation과 호환이 됩니다.

<br /><br />

# Module Federation

: `런타임에 통합`되어 각 앱이 서로 `코드를 공유`하는 기능입니다.

`다른 애플리케이션의 코드`를 `런타임`에 가져와서 `동적 로드`할 수 있는 플러그인입니다. 양뱡향으로 모듈 페더레이션이 가능하기 때문에 A 앱에서 B 앱의 코드를 불러올 수 있고 이 반대 상황도 가능합니다.
2020년 10월에 릴리즈된 Webpack5부터 추가된 내장 기능으로 처음 소개됐습니다. 넷플릭스나 아마존, AWS 등 해외 대기업에서도 사용하고 있다고 합니다.
<br />

#### Q, 왜 런타임에 하나?

빌드 타임에서 통합한다면, 만약 A 애플리케이션 모듈이 수정될 때 이를 사용하던 다른 B,C 애플리케이션도 다시 빌드/배포해야해서 마이크로 프론트엔드의 장점인 독립적 배포가 어려워집니다.
런타임에 통합하면, A 애플리케이션 모듈이 업데이트되면 이 코드를 사용하던 B 애플리케이션을 배포 안해도 A 코드의 변경사항이 실시간으로 반영됩니다. 따라서 런타임에 각 서비스가 개별적으로 배포해서 동적으로 로딩할 수 있게 됩니다.
<br /><br />

### 주요 용어 정리

- 모듈 : Webpack으로 번들링 가능한 리소스 (JS, CSS, HTML, JSON, Asset ..)

1. Host - 하나로 통합된 컨테이너.
2. Remote - Host로 통합될 모듈.
   다른 애플리케이션에서 사용하도록 노출(expose)해야 한다.
3. Local - 현재 애플리케이션 내 단일 빌드에 포함되는 일반적인 모듈
4. Exposes - 원격 모듈로 노출할 부분 지정.
   expose하면 Host가 원격 모듈의 코드를 사용할 수 있게 된다.
5. Container - 다른 애플리케이션에서 로드 가능한 단위
   ![](https://velog.velcdn.com/images/xmun74/post/95ba106b-f474-4edd-af1b-4bf5a7921b22/image.png)

<br /><br />

## 간단한 코드 예시

### 1. 원격에서 Webpack 설정하기

예를 들어 app1 애플리케이션의 Header.js를 공유하려고 expose하는 경우입니다.

- `name`은 모듈 페더레이션을 수행하는 앱 간 유일한 container 이름이어야 합니다.
- `filename`은 해당 앱에 대한 정보를 담는 Manifest 파일명을 지정하는 옵션으로 기본값이 remoteEntry.js입니다.
- `exposes`는 노출할 모듈들을 정의합니다. value 경로에 위치한 로컬 모듈을 key 경로의 원격 모듈로 expose합니다.

```js
// 원격a-services/webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1', // 원격 모듈 이름 - 중복 불가
      filename: 'remoteEntry.js',
      exposes: {
        // 원격 모듈에서 공유할 항목
        // `./Header` path로 `./src/components/Header.tsx`의 로컬 모듈을 expose함
        './Header': './src/components/Header.js',
      },
    }),
    // 번들링할 때 remoteEntry.js 파일 생성
  ],
}
```

### 2. 호스트에서 Webpack 설정하기

- `remotes` - 사용할 원격 모듈 목록

```js
new ModuleFederationPlugin({
    name: 'app2', // 호스트 이름
    remotes: {
       app1: 'app1@http://localhost:3001/remoteEntry.js',
    },
}),
```

- 호스트에서 원격 모듈 import해서 사용하기

```jsx
import 구현체 from '{container 원격 모듈 이름}/{exposes의 key 값}'
// Static import
import Header from 'app1/Header'
// Dynamic import
const Header = React.lazy(() => import('app1/Header'))
```

### 3. 공유 모듈 설정하기

- 호스트나 원격 모듈 전부 공통적으로 사용하는 공유 모듈이 있다면 이를 설정하여 런타임에 1번만 로딩하게 하는 설정입니다. 이로 인해 요청 횟수가 줄어들게 됩니다.
- [SharedConfig](https://github.com/webpack/webpack/blob/1f99ad6367f2b8a6ef17cce0e058f7a67fb7db18/declarations/plugins/sharing/SharePlugin.d.ts#L41)를 보면 다양한 옵션들이 있습니다.

```js
new ModuleFederationPlugin({
  shared: {
    ...deps,
    react: {
      sigleton: true,
      requiredVersion: '^18.0.0',
    },
  },
})
```

<br /><br />

---

# 마치며

MFE는 복잡도가 높기 때문에 대규모 서비스에서 서비스 특성에 따라서 확실한 장점이 있을 때 도입하는 것이 맞다고 생각했습니다.
다른 발표 자료들을 찾아볼 때 사용하는 기술, 의사결정 등 사용하는 예시마다 적용하고 선택하는 방식이 다 달라서 완벽한 best practice는 없다고 느껴졌습니다.
그리고 추가로 [module-federation-examples](https://github.com/module-federation/module-federation-examples) 깃헙에서 SSR, 양방향 호스트 등 다양한 예제들을 소개하고 있으니 참고하면 됩니다.

<br /><br /><br /><br />

참고

- [Micro Frontends - Martin Fowler 사이트](https://martinfowler.com/articles/micro-frontends.html)
- [Module Federation - Webpack 공식문서](https://webpack.js.org/concepts/module-federation/)
- https://github.com/module-federation/module-federation-examples
- [Webpack 5 Module Federation으로 Micro-Frontends 운영하기 - FEConf 유튜브](https://www.youtube.com/watch?v=0Eq6evGKJ68)
- [[SaaS] Micro Frontends를 위해 Module Federation 적용하기 - 강남언니 블로그](https://blog.gangnamunni.com/post/saas-microfrontends/)
