import { useMutation, gql } from '@apollo/client'

export const useAddTodoMutation = () => {
  const [createItem] = useMutation(mutation)
  return text => {
    console.log('text here', text)
    return createItem(getParams(text))
  }
}

const mutation = gql`
  mutation createItem($textInput: String!) {
    createItem(textInput: $textInput) {
      id
      text
    }
  }
`
const getParams = text => ({
  variables: {
    textInput: text
  }
})
