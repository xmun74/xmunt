---
title: 'lage-page-data warning'
description: '로드되는 페이지 데이터 용량이 클 경우 나타나는 경고문'
coverImage: ''
image: ''
date: '2023-03-06'
path: 'large-page-data'
category: 'NextJS'
tags:
  - next.js
---

NextJS로 블로그를 개발하던 중
로컬에 있는 md 파일을 읽어와서 글을 로드하고 있었다. 그런데 글이 길어질 경우 아래와 같은 경고가 계속 나왔다.
특정 페이지 용량이 128KB를 초과하여 성능이 저하될 수 있다는 경고문이었다.

- 경고창
  ![230306-104933](/images/posts/large-page-data/230306-104933.png)

#### LightHouse를 측정해본 결과

![230307-141940](/images/posts/large-page-data/230307-141940.png)
![230307-142155](/images/posts/large-page-data/230307-142155.png)
