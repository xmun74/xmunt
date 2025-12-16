# xmunt Blog

🔗 **Link**: [https://xmunt.vercel.app/](https://xmunt.vercel.app/)

## 🛠 stack

- Next.js
- TypeScript
- next-mdx-remote
- styled-components
- Recoil
- **[next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)** `4.3.0` - MDX 렌더링
- **[gray-matter](https://github.com/jonschlinkert/gray-matter)** `4.0.3` - Frontmatter 파싱
- **[rehype-prism-plus](https://github.com/timlrx/rehype-prism-plus)** - 코드 하이라이팅
- **[remark-gfm](https://github.com/remarkjs/remark-gfm)** - GitHub Flavored Markdown

## 📝 write

1. `_posts/` 디렉토리에 새 `.md` 파일 생성
2. Frontmatter 작성:

   ```markdown
   ---
   title: '포스트 제목'
   description: '포스트 설명'
   coverImage: '/images/posts/example/cover.jpg'
   date: '2024-01-01'
   path: 'post-slug'
   category: '카테고리'
   tags:
     - '태그1'
     - '태그2'
   ---

   # 포스트 내용
   ```

3. 이미지 복사 : **Paste Image** 사용 (단축키: `Option + Command + V`)
