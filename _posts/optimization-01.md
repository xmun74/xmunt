---
title: '빌드 속도 최소화? 근데 이제 Webpack과 React을 곁들인'
description: '빌드 속도를 줄이고 번들 크기를 줄여보자'
coverImage: ''
image: ''
date: '2023-09-01'
path: 'optimization-01'
category: '성능 최적화'
tags:
  - webpack
  - react
  - code splitting
---

> 프로젝트가 커질 수록 번들 크기는 무거워지고 빌드 속도가 느려질 수 있습니다. 사용자가 첫 페이지에 진입할 때 느린 초기 로딩을 경험하지 않게 하기 위해서 Webpack과 React를 활용하여 코드를 분할하고 빌드 속도를 개선하는 방법을 살펴보겠습니다.

<br /><br />

### 🕖 빌드 시간 측정하기

- [speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin)로 Webpack loader와 plugin의 빌드 속도를 측정할 수 있습니다.
- 사용 예시
  ```js
  // webpack.common.js
  const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
  const smp = new SpeedMeasurePlugin()
  const webpackConfig = smp.wrap({
    plugins: [
      //...
    ],
  })
  ```

### 📐 번들 크기 분석하기

- [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)를 사용하여 번들 크기를 분석했습니다.
- 사용 예시

  ```js
  // webpack.production.js
  const BundleAnalyzerPlugin =
    require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  const { merge } = require('webpack-merge')
  const common = require('./webpack.common.js')

  module.exports = merge(common, {
    mode: 'production',
    plugins: [
      new BundleAnalyzerPlugin({
        openAnalyzer: true, // 보고서를 브라우저로 자동 오픈
      }),
    ],
    //...
  })
  ```

### Webpack 개발 모드 참고사항

1. devtool : 웹팩 공식 문서에서는 `eval-cheap-module-source-map` 을 권장
2. 제외해야 할 플러그인
   왜냐하면 개발 모드일때는 빌드 속도가 빠르고 디버깅하기 쉬워야하기 때문에 압축 등 최적화 작업이 불필요합니다.
   - TerserPlugin
   - [fullhash]/[chunkhash]/[contenthash]
   - AggressiveSplittingPlugin
   - AggressiveMergingPlugin
   - ModuleConcatenationPlugin

<br /><br />

---

<br /><br />

# 빌드 시간 최적화 방법

development 모드에서는 빠른 빌드 속도와 디버깅이 편하기 위해 파일압축 등의 최적화 작업이 불필요하지만, production 모드일 때는 번들 크기를 줄여야하기 때문에 압축(Minify), 난독화 등의 최적화 작업이 필요합니다. 따라서 번들 크기를 줄이거나 빌드 속도를 최적화하는 방법을 알아보겠습니다.
<br />

> **압축(Minify)**
> : 공백/들여쓰기, 주석, debugger, console.log 등을 제거하는 작업
> **난독화(Uglify)**
> : 기존 변수명, 함수명을 다르게 치환하는 보안 처리 작업. 난독화 단계가 높을 수록 코드를 해석하고 실행하는 시간이 늘어난다.

 <br />

1. 불필요한 loader, plugin 제거
2. loader 교체하기
3. Code Splitting

<br /><br />

## 1. 불필요한 loader, plugin 제거

#### Webpack v5부터 추가된 Asset 모듈 유형 사용하기

v5 이전까진 `file-loader`, `url-loader`, `raw-loader`를 사용했지만, v5 이후부터 이 loader들을 대체하기 위한 모듈 유형이 추가됐습니다. 따라서 불필요해진 loader들을 제거하고 최소한으로 loader를 관리할 수 있게 됐습니다.

- [Asset Modules](https://webpack.kr/guides/asset-modules/)
  - asset/resource : file-loader 대체
  - asset/inline : url-loader 대체
  - asset/source : raw-loader 대체
- 사용예시
  ```js
  module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|ico|webp)$/,
          type: 'asset/resource',
          generator: {
            filename: 'images/[hash][ext][query]',
          },
        },
      ],
    },
  ```

<br />

## 2. loader 교체하기

#### 트랜스파일 loader 교체하기

제일 처음에는 `babel-loader`를 사용했었습니다.
하지만 파일 압축 플러그인을 설치 안했을 때 빌드 속도가 4.6s였기 때문에 플러그인을 추가 설치한다면 속도가 늘어날 것으로 예상됐습니다. 그래서 아예 loader를 교체해 빌드 속도를 줄이고자 했습니다.
loader 종류로는 `babel-loader`, `ts-loader`, `esbuild-loader`, `swc-loader` 등이 있습니다. 이 중 앞선 3개 로더를 중심으로 살펴보겠습니다.

<br />

#### 1. `babel-loader` - 4.6s 소요됨 (플러그인 미설치 기준)

- 압축 플러그인 추가 설치 필요
  `terser-webpack-plugin` : JS 축소 플러그인(webpack v5 이상이면 내장되어 있어서 추가 설치 불필요)
  `css-minimizer-webpack-plugin` : CSS 축소 플러그인

#### 2. `ts-loader`

- 타입스크립트 사용 시
- 한계점 : 타입 검사하는 시간 때문에 빌드 속도가 저하됨
- 한계점 보완하기 위해 `forkTsCheckerWebpackPlugin` 설치 필요
- `forkTsCheckerWebpackPlugin`
  : 별도의 스레드에서 타입 검사 진행하므로 빌드 시간을 줄일 수 있다.
  - `transpileOnly: true` 옵션 활성화해서 `ts-loader`의 타입 검사를 해제하고 트랜스파일링만 수행하게 합니다.
    해당 옵션은 `forkTsCheckerWebpackPlugin`을 사용한다면
    `transpileOnly: true` 옵션이 자동 활성화되어있지만
    `ts-loader` v9.3.0 미만이라면 옵션을 활성화시켜줘야 합니다.
  - 예시
  ```js
  const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
  //...
  module.exports = {
    // ...
    module: {
      rules: [
        {
          test: /.([cm]?ts|tsx)$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true, // ts-loader v9.3.0 미만 시 옵션 활성화
          },
        },
      ],
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin(),
      // ...
    ],
  }
  ```

#### 3. `esbuild-loader` - ✅ 선택 2.1s 소요됨

- 압축 플러그인이 내장되어 추가 설치 불필요
  `EsbuildPlugin` - JS 축소 플러그인
- 사용 중인 라이브러리와 호환이 안될 수 있어서 브라우저에서 정상 동작하는지 확인 필요
- 타입 검사를 위해서 build script에 tsc 추가
  ```json
  //package.json 예시
  "typecheck": "tsc --noEmit",
  "build": "npm run typecheck && webpack"
  ```

> ### esbuild 란?
>
> esbuild는 차세대 번들러로 webpack5보다 빠른 속도를 가지고 있습니다. [(esbuild가 빠른 이유 - esbuild 공식문서)](https://esbuild.github.io/faq/) > ![](https://velog.velcdn.com/images/xmun74/post/19ce4ad4-cc92-4554-bda1-b3b7f10e101a/image.png)
> 이렇게나 빠른데 esbuild를 번들러로 사용하지 않는 이유가 있습니다!
> 아직까진 안정화된 단계가 아닌 점과 주의할 사항으로 Hot-module reloading, TypeScript 타입 검사 등의 기능 지원은 앞으로 없다고 합니다.[(참고)](https://esbuild.github.io/faq/#upcoming-roadmap)
> 그런데 esbuild는 `esbuild-loader`를 지원하기 때문에 webpack의 loader와 결합할 수 있어서 webpack의 빌드 성능을 개선하는 데 활용할 수 있습니다.

<br /><br />

### ✅ esbuild-loader 적용 예시

- webpack.common.js

```js
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const dotenv = require('dotenv')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const webpack = require('webpack')

const smp = new SpeedMeasurePlugin() // 빌드속도 측정 플러그인

dotenv.config()
module.exports = smp.wrap({
  entry: `${path.resolve(__dirname, './src')}/index.tsx`,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].bundle.js',
    chunkFilename: '[name].[contenthash].chunk.bundle.js',
    clean: true,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: 'esbuild-loader', //esbuild-loader로 교체
        options: {
          target: 'es2015',
        },
      },
      {
        test: /\.(png|jpe?g|gif|ico|webp)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]',
        },
      },
      {
        test: /\.css?$/,
        exclude: [],
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
      favicon: './public/favicons/favicon.ico',
    }),
    new webpack.EnvironmentPlugin(['API_URL', 'USER_IMG_FIELD', 'CLIENT_URL']),
  ],
})
```

- webpack.dev.js

```js
/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 3000,
    open: true, // 개발 서버 실행하면 브라우저 자동 오픈
    // hot: true, // HMR(Hot Module Replacement) 사용할 수 있게 함. 4버전부터 자동 활성화됨.
    historyApiFallback: true, //spa에서 react-router-dom 사용할 때 404에러 발생 방지
    compress: true, // gzip 압축
  },
  optimization: {
    minimize: false, // Terser 압축 플러그인 비활성화
  },
})
```

- webpack.prod.js

```js
/* eslint-disable @typescript-eslint/no-var-requires */
const { EsbuildPlugin } = require('esbuild-loader')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new BundleAnalyzerPlugin({
      openAnalyzer: true, //번들 보고서를 브라우저로 자동 오픈
    }),
  ],
  optimization: {
    minimizer: [
      // EsbuildPlugin으로 JS 축소
      new EsbuildPlugin({
        target: 'es2015',
        css: true, // CSS assets 축소
      }),
    ],
  },
})
```

<br /><br />

### 로더 교체 전/후 빌드 속도 비교

- `babel-loader`일 때 `speed-measure-webpack-plugin`으로 빌드 시간을 측정한 결과 4.65s 소요
  ![](https://velog.velcdn.com/images/xmun74/post/bbffbbbc-7bc1-4b2b-a988-d9518690a38b/image.png)
- `esbuild-loader`로 변경 후 2.12s로 **약 2초 감소**
  ![](https://velog.velcdn.com/images/xmun74/post/3f624ea8-8f5d-4360-8f84-12a9fe4a4a83/image.png)

<br /><br /><br /><br />

## 3. Code-Splitting

여러 개의 파일들을 하나의 파일로 번들링하다보니 용량이 커지게 됩니다.
이로 인해 SPA일 때 사용자가 첫 페이지에 진입하면 모든 코드가 포함된 대용량의 파일을 다운받다보니 초기 로드 시간이 길어지는 문제가 발생합니다.
때문에 사용자와의 상호작용이 늦어지게 되어 사용자 경험을 저하시키게 됩니다.
초기 로드 시간이 길어지면 사용자 이탈이 증가하기 때문에 초기 렌더링 시간을 단축하는 것이 중요합니다.
<br />
따라서 이를 해결하기 위해 Code-Splitting이 나타나게 됐습니다.
대용량인 하나의 번들링 파일을 여러 개의 파일로 분할하는 작업입니다.
이렇게 코드 분할한 뒤 사용자가 첫 페이지에 진입 시 필요한 코드만 불러오면 되기 때문에 좋은 사용자 경험을 제공할 수 있게 됩니다.
<br />
Code-Splitting을 두가지로 나눠서 살펴보겠습니다.

<br />

1. [Webpack으로 코드 분할하기](https://webpack.kr/guides/code-splitting/)
2. React lazy로 특정 컴포넌트를 분할하고 동적 import하기

<br /><br />

### 1. Webpack으로 코드 분할하기

#### 청크 분할하기

- optimization의 `splitChunks`
  : 큰 번들을 작은 번들로 분리하여 로딩 속도 개선하는 작업
  ```js
  module.exports = {
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
    },
    optimization: {
      splitChunks: {
        chunks: 'all', // 모든 유형의 청크 포함
      },
    },
  }
  ```
- 리액트 관련 패키지끼리 모아서 분리하기
  리액트를 프로젝트 거의 모든 곳에서 사용하고 있기 때문에 별도의 번들로 분리했습니다. 초기에 리액트 번들 + main 번들을 다운받고나서 업데이트를 하면 리액트 번들을 다시 다운 안받기 위해서 분리했습니다.
  ```js
  optimization: {
      splitChunks: {
        chunks: 'all', // 리액트 외 것들 분리
        // 리액트 관련 패키지들을 번들로 묶어서 분리
        cacheGroups: {
          reactVendor: { // 코드분할하는 그룹명 지정
            // 정규 표현식으로 모듈 분리 대상 지정
            test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
            name: 'vendor-react', // 출력될 번들 파일명
            chunks: 'all', // 모든 유형의 청크에서 해당 패키지 분리
          },
        },
      },
    },
  ```
- build 후 출력된 dist/index.html을 살펴보면 아래처럼
  vender-react 번들, 674.~번들, main 번들로 분할된 것을 확인할 수 있습니다.
  ![](https://velog.velcdn.com/images/xmun74/post/e21797f4-74bb-461e-8a67-bb5c707b43bc/image.png)
- `webpack-bundle-analyzer`를 사용하여 확인한 번들
  ![](https://velog.velcdn.com/images/xmun74/post/acde96b4-42d5-4ffe-91aa-fa7d999a9ecc/image.png)

<br /><br /><br />

### 2. React lazy 사용하기

위에서 webpack의 code splitting을 통해 번들 파일을 분할했다면
React lazy 기능으로 필요할 때만 컴포넌트를 동적 import 해오도록 작업해줘야 합니다.

#### React lazy, Suspense

`React lazy`는 컴포넌트를 JS Chunk으로 분리하게 해줍니다. 예를 들어서 Home 페이지 컴포넌트를 따로 Home.Chunk 번들 파일로 분할해주는 것입니다.
`Suspense`를 사용하면 지연이 발생할 때 로딩중인 스피너를 띄운다던지 로딩상태를 표시할 수 있습니다.
<br />
위에서 674 번들처럼 번들명이 id로 자동으로 생성된 것을 볼 수 있습니다. id로 자동 생성된 번들명이 아니라 직관적인 번들명으로 지정해보겠습니다.

<br />

#### 주석으로 번들명 지정하기

- `/* webpackChunkName: "번들명" */` 주석으로 번들명 지정하기

  ```tsx
  import React, { Suspense, lazy } from 'react'

  const Home = lazy(() => import(/* webpackChunkName: "home" */ '@/pages/Home'))
  const Bible = lazy(
    () => import(/* webpackChunkName: "bible" */ '@/pages/Bible')
  )
  const Profile = lazy(
    () => import(/* webpackChunkName: "profile" */ '@/pages/Profile')
  )

  const App = () => (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bible" element={<Bible />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </Router>
  )
  ```

- webpack.common.js에서 설정
  `chunkFilename` : 고유 해쉬값으로 청크 파일명 생성하여 중복 방지
  ```js
  module.exports = {
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
      // 분할된 청크 파일명 지정
      chunkFilename: '[name].[chunkhash].bundle.js',
    },
  }
  ```
  위에 지정된 번들명으로 파일이 잘 생성된 것을 확인할 수 있습니다.
  ![](https://velog.velcdn.com/images/xmun74/post/7a555cee-db22-4baa-b51e-225a82a2229e/image.png)

#### TS 사용 시 tsconfig 설정 참고하기

- module 설정
  `"module": "esnext"`
  동적 import를 사용하기 위해선 module이 다음과 같은 설정일 때 동작합니다.
  'es2020', 'es2022', 'esnext', 'commonjs', 'amd', 'system', 'umd', 'node16', 'nodenext'
- 주석 제거 설정 비활성화
  `"removeComments": false`
  TS 컴파일 과정에서 주석을 제거하면 Webpack에서 번들명 지정 주석을 읽기 전에 삭제되어 정상 작동안될 수 있습니다. 또한 Webpack에서도 Minify 압축할 때 주석을 제거하므로 tsconfig에서 해당 옵션을 비활성화합니다.
  ```json
  compilerOptions: {
    "module": "esnext",
    "removeComments": false,
    // ...
  }
  ```

<br /><br />

### code splitting 전 후 번들 크기 비교

yarn build를 하면 보고서가 브라우저에 자동으로 열립니다.
밑 사진과 같이 main에 커서를 올려서 용량을 알 수 있습니다.
<br />

> - Stat - 파일 입력 크키 (축소 전 크기)
> - Parsed - 파일 출력 크기 (Minify, Uglify 등 축소 후 크기)
> - Gzipped - 압축돼서 네트워크에 로드되는 크기

<br />

- 전 - Stat : 738KB / Parsed : 739KB / Gzipped : 179KB
  ![](https://velog.velcdn.com/images/xmun74/post/6c97f601-b227-4de8-b9b1-ba417cb526b6/image.png)
- 후 - Stat : 753KB / Parsed : 400KB / Gzipped : 130KB
  Gzipped 기준으로 **약 27% 감소**
  ![](https://velog.velcdn.com/images/xmun74/post/91e32d7a-8252-4232-8452-09ae829d85a9/image.png)

<br /><br /><br /><br />

---

<br /><br /><br /><br />

# 참고

[Webpack 공식문서 - 빌드 성능](https://webpack.kr/guides/build-performance/)
[esbuild-loader github](https://github.com/esbuild-kit/esbuild-loader)
https://www.codemzy.com/blog/react-bundle-size-webpack-code-splitting
