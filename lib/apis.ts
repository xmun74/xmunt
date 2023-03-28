const get = async (path: string, headers = {}) => {
  const url = `/api${path}`
  const options = {
    headers: {
      Accept: 'application/json',
      ...headers,
    },
  }
  const res = await fetch(url, options)
  const data = await res.json()
  if (res.ok) {
    // console.log('fetch 됨', data)
    return data
  }
  throw Error(data)
}

export const blogsApi = {
  getBlogs: () => get(`/blogs`),
}

export const postsApi = {
  searchPosts: (text: string) => get(`/search?q=${text}`),
}
