const PORT = 4000
const http = require('http')
const axios = require('axios')
const express = require('express'),
  app = express(),
  cors = require('cors')

const { v4: uuidv4 } = require('uuid')

const { ApolloServer, gql } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

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
    getTasks: async (parent, args, ctx, info) => {
      const { id, search } = args
      if (id && search)
        throw new Error(
          'pick a lane and stay in it. Use an ID or a search term'
        )
      if (id) {
        const taskResp = await ctx.api.get(`/tasks/${id}`)
        if (taskResp?.status !== 200) {
          throw new Error('Failed to get user')
        }

        return [taskResp?.data]
      }
      if (search) {
        const tasksResp = await ctx.api.get('/tasks')
        if (tasksResp?.status !== 200) {
          throw new Error('failed to get users')
        }

        return tasksResp?.data?.filter(task =>
          task.task.toLowerCase().includes(search)
        )
      }
      const tasksResp = await ctx.api.get('/tasks')
      if (tasksResp?.status !== 200) {
        throw new Error('failed to get users')
      }
      return tasksResp?.data
    }
  },

  Mutation: {
    addTodo: async (parent, args, ctx, info) => {
      const id = uuidv4()

      const taskResp = await ctx.api.post('/tasks', { task: args?.task })
      return taskResp?.data
    },
    updateTodo: async (parent, args, ctx, info) => {
      // tasks = tasks.filter(task => task.id !== args?.id)
      // const pretendUpdatedTask = { id: args?.id, task: args?.task }
      const updatedTask = await ctx.api.put(`/tasks/${args?.id}`, {
        task: args?.task
      })

      return updatedTask?.data
    },
    deleteTodo: async (parent, args, ctx, info) => {
      const deletedTaskResp = await ctx.api.delete(`/tasks/${args?.id}`)
      console.log('deleteresponse', deletedTaskResp)
      return {
        message: deletedTaskResp?.statusText
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
    context: ({ req }) => ({
      api
    }),
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
