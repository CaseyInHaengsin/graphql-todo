import styled from 'styled-components'
import List from './components/List'

function App () {
  return (
    <div
      className='App'
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Header></Header>
      <List />
    </div>
  )
}

const Header = styled.h1``
export default App
