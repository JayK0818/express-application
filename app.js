const express = require('express')
const helmet = require('helmet')
const fs = require('node:fs')
const path = require('node:path')
const compression = require('compression')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const todoRouter = require('./router/todo')
const userRouter = require('./router/user')
const viewsRouter = require('./router/views')
const chalk = require('chalk')
const mongoose = require('mongoose')
const responseTime = require('response-time')
const session = require('express-session')
const mongoStore = require('connect-mongo')
const cors = require('cors')
const { rateLimit } = require('express-rate-limit')
const RateLimitMongoStore = require('rate-limit-mongo')

require('dotenv').config({
  path: ['.env', `.env.${process.env.NODE_ENV}`],
})
const PORT = process.env.PORT || 3000

const app = express()

app.use(
  cors({
    methods: 'POST, GET',
    credentials: true,
    preflightContinue: false,
  })
)

app.use(
  rateLimit({
    windowMs: 1000 * 5,
    limit: 20,
    legacyHeaders: false,
    standardHeaders: false,
    message: '请求次数过多, 请稍后再试',
    store: new RateLimitMongoStore({
      uri: 'mongodb://127.0.0.1:27017/mongodb',
      expireTimeMs: 1000 * 5,
      collectionName: 'rate-limit',
    }),
    skip: (req, res) => {
      const path = req.url
      return !path.includes('/api')
    },
  })
)

/**
 * create a middleware that adds a X-Response-Time header to responses.
 */
app.use(responseTime())

app.use(
  session({
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2,
      sameSite: true,
      secure: false, // When setting this to true, clients will not send the cookie back to the server in the future if the browser
      // done not have an HTTPS connection.
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
      autoRemove: 'interval',
      autoRemoveInterval: 10, // in minutes
      mongoUrl: 'mongodb://127.0.0.1:27017/mongodb',
    }),
  })
)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'script-src': ["'self'", "'unsafe-eval'"],
        'connect-src': ['*'],
      },
    },
  })
)
app.use(compression())
// 设置模版引擎

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// 第三方库
app.use(express.static(path.join(__dirname, 'node_modules')))

// 静态资源
app.use(
  express.static(path.join(__dirname, './public'), {
    extensions: ['html'],
  })
)

app.use((req, res, next) => {
  console.log(
    chalk.bold.yellow(`
    Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
    Method: ${req.method}
    URL: ${req.url}`)
  )
  next()
})

app.use((req, res, next) => {
  next()
})

// 生成日志文件的逻辑
const logFileGenerator = () => {
  const date = new Date()
  const pad = (num) => (num > 9 ? '' : '0') + num
  const month = date.getFullYear() + '' + pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  return path.resolve(process.cwd(), 'log', `${month}/${month}${day}.log`)
}
const stream = rfs.createStream(logFileGenerator, {
  size: '10M',
  interval: '3d',
})
app.use(
  morgan(
    'Date: :date[web] HTTP: :http-version User-Agent: :user-agent Method :method URL: :url :status',
    {
      stream,
      immediate: true,
    }
  )
)

// local variables within the application
app.locals.title = 'express application'

// This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(
  express.json({
    inflate: true, // enables or disables handling deflated (compressed) bodies
    limit: '200kb', // controls the maximum request body size
    reviver: null, // passed directly to JSON.parse as second argument.
    type: ['application/json'], // determine what media type the middleware will parse.
  })
)

/**
 * app.use(express.raw()) This is a built-in middleware function in Express, It parses incoming request payloads into a Buffer
  app.use(express.text()) This is a built-in middleware function in Express, It parses incoming request payloads into a string
*/

/**
 * It parses incoming requests with urlencoded payloads and is based on body-parser.
 */
app.use(
  express.urlencoded({
    extended: true, // allows to choose between parsing the URL-encoded data with the querystring library or the qs library
    type: 'application/x-www-form-urlencoded', // determine what media type the middleware will parse
    parameterLimit: 1000, // controls the maximum number of parameters
  })
)

// 拦截响应
app.use((req, res, next) => {
  const _json = res.json
  res.original_json = _json
  // 改写res.json
  res.json = (data) => {
    res.json = _json
    return res.json({
      code: 200,
      data,
      msg: 'success',
    })
  }
  next()
})

// 路由
app.use('/api/todo', todoRouter)
app.use('/api/user', userRouter)
app.use('/', viewsRouter)

/**
 * Development-only error handler middleware
 */
/* if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler())
} */

// 404处理
app.use((req, res, next) => {
  res.status(404).original_json({
    code: 0,
    msg: 'Not Found',
  })
})
// 错误处理
app.use(function (err, req, res, next) {
  res.status(200).original_json({
    code: 0,
    data: null,
    msg: typeof err === 'string' ? err : err.message ? err.message : err,
  })
})

const connect = async () => {
  try {
    // console.log(chalk.blue('正在连接数据库...'))
    await mongoose.connect('mongodb://127.0.0.1:27017/mongodb', {
      autoIndex: process.env.NODE_ENV === 'development',
      serverSelectionTimeoutMS: 30 * 1000,
    })
    console.log(chalk.blue('数据库连接成!'))
    app.listen(PORT, () => {
      console.log(chalk.red.bold(`express start at ${PORT}`))
    })
  } catch (err) {
    console.log(chalk.red(`数据库连接失败 ${err}`))
  }
}
mongoose.connection.on('connecting', () => {
  console.log(chalk.blue('正在连接数据库...'))
})
mongoose.connection.on('connected', () => {
  console.log(chalk.blue.bold('连接成功！！！！'))
})

// To handle errors after initial connection was established.
mongoose.connection.on('error', (err) => {
  console.log(chalk.red(err))
})

connect()
