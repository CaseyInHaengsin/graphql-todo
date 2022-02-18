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
    getTasks(id: ID, search: String): [Task]
  }

  type Status {
    message: String
  }

  type Mutation {
    addTodo(task: String!): Task
    updateTodo(id: ID!, task: String!): Task
    deleteTodo(id: ID!): Status
  }
`
const resolvers = {
  Query: {
    getTasks: (parent, args, ctx, info) => {
      const { id, search } = args
      if (id && search)
        throw new Error(
          'pick a lane and stay in it. Use an ID or a search term'
        )
      if (id) {
        return tasks.find(task => task.id === id)
      }
      if (search) {
        return tasks.filter(task => task.task.toLowerCase().includes(search))
      }
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
    },
    deleteTodo: (parent, args, ctx, info) => {
      tasks = tasks.filter(task => task.id !== args?.id)

      return {
        message: `yay, you deleted the task with id ${args?.id}`
      }
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
