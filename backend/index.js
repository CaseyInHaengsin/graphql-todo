const PORT = 7733
const http = require('http')
const express = require('express'),
  app = express(),
  cors = require('cors')

const { v4: uuidv4 } = require('uuid')
const { ApolloServer, gql } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')

let tasks = [
  {
    id: '1',
    task: 'Do cool things'
  },
  {
    id: '2',
    task: 'Do another cool thing'
  }
]

const typeDefs = gql`
  type Task {
    id: ID!
    task: String!
  }

  type Query {
    greetings: String
    anotherGreeting: String
    getTasks: [Task]
  }

  type Mutation {
    addTodo(task: String!): Task
    updateTodo(id: ID!, task: String!): Task
  }
`
const resolvers = {
  Query: {
    getTasks: () => {
      return tasks
    }
  },

  Mutation: {
    addTodo: (parent, args, ctx, info) => {
      const id = uuidv4()
      const task = { task: args?.task, id: id }
      tasks = [...tasks, task]
      return task
    },
    updateTodo: (parent, args, ctx, info) => {
      tasks = tasks.filter(task => task.id !== args?.id)
      const pretendUpdatedTask = { id: args?.id, task: args?.task }
      tasks = [...tasks, pretendUpdatedTask]
      return pretendUpdatedTask
    }
  }
}
app.use(cors())

async function startApolloServer (typeDefs, resolvers) {
  const httpServer = http.createServer(app)
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  })
  await server.start()
  server.applyMiddleware({ app })
  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve))
  console.log('started server')
}

startApolloServer(typeDefs, resolvers).then(() =>
  console.log('started, seriously')
)
