import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import GlobalStyle from '../styles/GlobalStyle'
import '../styles/dracula-prism.css'
import Layout from '../components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <GlobalStyle />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
  )
}
