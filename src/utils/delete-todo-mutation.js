import { useMutation, gql } from '@apollo/client'

export const useDeleteItemMutation = () => {
  const [deleteItem] = useMutation(mutation)

  return id => deleteItem(getParams(id))
}

const mutation = gql`
  mutation($id: ID!) {
    deleteItem(id: $id)
  }
`

const getParams = id => ({
  variables: {
    id
  }
})
