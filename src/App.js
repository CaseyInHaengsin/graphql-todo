import styled from 'styled-components'
import { ApolloProvider } from '@apollo/client'
import client from './utils/apollo-client'
import List from './components/List'

function App () {
  return (
    <ApolloProvider client={client}>
      <Main>
        <Header></Header>
        <List />
      </Main>
    </ApolloProvider>
  )
}

const Main = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Header = styled.h1``
export default App
