const { ApolloServer, gql } = require('apollo-server')
const { nanoid } = require('nanoid')
const fs = require('fs/promises')

const PORT = 7733
const db = `${__dirname}/data.json`

const typeDefs = gql`
  type Query {
    list: [Item!]
    getItems: [Item]
    getItem(idInput: ID!): Item
  }

  type Item {
    text: String!
    id: ID!
    finished: Boolean
    category: String
  }

  input ItemInput {
    text: String!
    id: ID!
    finished: Boolean
    category: String
  }

  type Mutation {
    createItem(textInput: String!): Item
    updateItem(input: ItemInput!, id: ID!): Item
    deleteItem(id: ID!): String
  }
`

// need to Delete
const resolvers = {
  Query: {
    getItems: (_, __, { db }) => {
      return getItems(db)
    },
    getItem: (_, { idInput }, { db }) => {
      return getItem(db, idInput)
    }
  },
  Mutation: {
    createItem: (_, { textInput }, { db }) => {
      return create(db, textInput)
    },
    updateItem: (_, { input, id }, { db }) => {
      return update(db, id, input)
    },
    deleteItem: (_, { id }, { db }) => {
      return remove(db, id)
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers, context: { db } })
server.listen({ port: PORT }).then(({ url }) => {
  console.log(`Oh Boy!! The server is ready at ${url}`)
})

//
// CRUD functions
//

function create (db, text) {
  const item = { text, id: nanoid(), finished: false }
  getItems(db).then(e => {
    if (!Array.isArray(e)) e = [] // maybe don't need this? Just in case though
    e.push(item)
    fs.writeFile(db, JSON.stringify(e))
  })
  return item
}

function getItems (db) {
  return fs.readFile(db, 'utf-8').then(e => JSON.parse(e))
}

function getItem (db, id) {
  return getItems(db).then(e => e.filter(t => t.id === id).pop())
}

function update (db, id, input) {
  getItems(db).then(res => {
    let index = res.findIndex(e => e.id === id)
    if (index === -1) index = res.length
    res.splice(index, 1, input)
    fs.writeFile(db, JSON.stringify(res))
  })
  return input
}

function remove (db, id) {
  getItems(db).then(res => {
    res = res.filter(t => t.id !== id)
    fs.writeFile(db, JSON.stringify(res))
  })
  return `${id} has been deleted`
}
