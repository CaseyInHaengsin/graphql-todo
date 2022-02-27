import { useMutation, gql } from '@apollo/client'

export const useUpdateTodoMutation = () => {
  const [updateItem] = useMutation(mutation)
  return (id, text) => updateItem(getParams(id, text))
}

const mutation = gql`
  mutation($input: ItemInput!) {
    updateItem(input: $input) {
      id
      text
    }
  }
`

const getParams = (id, text) => ({
  variables: {
    input: {
      id,
      text
    }
  }
})
