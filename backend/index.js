const { ApolloServer, gql } = require('apollo-server')

const typeDefs = gql`
  type Query {
    list: [Item!]
  }

  type Item {
    text: String!
    id: ID!
    category: String
  }
`

const resolvers = {}

const database = [
  { text: 'list item 1', id: 1 },
  { text: 'list item two', id: 2 },
  { text: 'list item III', id: 3 }
]

const PORT = 7733

const server = new ApolloServer({ typeDefs, resolvers })
server.listen({ port: PORT }).then(({ url }) => {
  console.log(`Server is ready at ${url}`)
})
