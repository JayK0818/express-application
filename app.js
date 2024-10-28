const express = require('express')
const helmet = require('helmet');
const fs = require('node:fs');
const path = require('node:path');
const compression = require('compression')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const todoRouter = require('./router/todo');
const chalk = require('chalk')

require('dotenv').config({
  path: ['.env', `.env.${process.env.NODE_ENV}`]
})

const app = express()

app.use(helmet())
app.use(compression())
app.use((req, res, next) => {
   console.log(chalk.bold.yellow(`
    Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
    Method: ${req.method}
    URL: ${req.url}`
  ))
  next()
});

app.use((req, res, next) => {
  next()
})

// 生成日志文件的逻辑
const logFileGenerator = () => {
  const date = new Date()
  const pad = num => (num > 9 ? "" : "0") + num;
  const month = date.getFullYear() + "" + pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  return path.resolve(process.cwd(), 'log', `${month}/${month}${day}.log`)
}
const stream = rfs.createStream(logFileGenerator, {
  size: "10M",
  interval: "3d"
})
app.use(morgan('Date: :date[web] HTTP: :http-version User-Agent: :user-agent Method :method URL: :url :status', {
  stream,
  immediate: true
}))

// local variables within the application
app.locals.title = 'express application'

// This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(express.json({
  inflate: true,  // enables or disables handling deflated (compressed) bodies
  limit: '200kb', // controls the maximum request body size
  reviver: null,  // passed directly to JSON.parse as second argument.
  type: ['application/json'], // determine what media type the middleware will parse.
}));

/**
 * app.use(express.raw()) This is a built-in middleware function in Express, It parses incoming request payloads into a Buffer
  app.use(express.text()) This is a built-in middleware function in Express, It parses incoming request payloads into a string
*/

/**
 * It parses incoming requests with urlencoded payloads and is based on body-parser.
*/
app.use(express.urlencoded({
  extended: true, // allows to choose between parsing the URL-encoded data with the querystring library or the qs library
  type: 'application/x-www-form-urlencoded',  // determine what media type the middleware will parse
  parameterLimit: 1000  // controls the maximum number of parameters
}));

// 拦截响应
app.use((req, res, next) => {
  const _json = res.json
  res.json = data => {
    res.json = _json
    return res.json({
      code: 200,
      data,
      msg: 'success'
    })
  }
  next()
})

// 路由
app.use('/api/todo', todoRouter)

// 404处理
app.use((req, res, next) => {
  res.status(404).json({
    code: 0,
    message: 'Not Found'
  })
})
// 错误处理
app.use(function (err, req, res, next) {
  res.status(200).json({
    code: 0,
    data: null,
    msg: err?.message
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(chalk.red.bold(`express start at ${PORT}`))
})