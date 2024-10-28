# Express

  Express 是基于Node.js 平台 快速 开放 极简的Web开发框架

## Middleware

  Middleware functions are functions that have access to the request, response object and the next function
  in applications's request-response cycle.

```js
// Application-level middleware
const app = express()
app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})
// 限定请求路径
app.use('/user', (req, res, next) => {
  next()
});

// 一个拦截响应的中间件
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

// Router-level middleware
const router = express.Router()

router.use(function (req, res, next) {
  next()
});
```

  Express comes with a built-in error handler that takes care of any errors that might be encountered in the app.
  This default error-handing middleware function is added at the end of the middleware function stack.

```js
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

// 或者定义不同类别的错误处理中间件
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

// 在某个路由中
const addTodo = (req, res, next) => {
/*   try {
    console.log(a)
    res.json('hello world!123456')
  } catch (err) {
    next(err)
  } */
  console.log(a)
  // 以上两种方式的错误都会被 错误中间件捕获
}

// 404处理
app.use((req, res, next) => {
  res.status(404).json({
    code: 0,
    message: 'Not Found'
  })
})
```

### helmet

  help secure Express/Connect apps with various Http headers
  Helmet sets the following headers by default:

### compression

  The middleware will attempt to compress response bodies for all request that traverse through the middleware.

```js
const compression = require('compression')
const express = require('express')

const app = express()

app.use(compression({
  chunkSize: 16384, // The default value is zlib.Z_DEFAULT_CHUNK, or 16384
  filter: (req, res) => true, // A function to decide if the response should be considered for compression.
  level: 6  // The level of zlib compression to apply to responses.
  /**
   * A higher level will result in better compression, but will take longer to complete. A lower level will result
   * in less compression, but will be much faster.
   * 0-9,  -1 means the 'default compression level'
  */
}))
```

### morgan

  HTTP request logger middleware for node.js

```js
const morgan = require('morgan');

// using the predefined format string
morgan('tiny')

// using format string
morgan(':method :url :status :res[content-length] - :response-time ms');


// 接受tokens.type(req, res)的参数
morgan.token('type', (req, res) => {
  return req.headers['content-type']
})
morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
})
```

### rotating-file-stream

  Creates a stream.Writable to a file which is rotated. Rotation behavior can be deeply customized.

  rfs.createStream(filename | Function, options)

```js
const rfs = require('rotating-file-stream')
const stream = rfs.createStream('file.log', {
  size: '10M',
  interval: '1d',
  compress: 'gzip'
})
```

  The most complex problem about file name is :how to call the rotated file name

```js
// 官网的一个demo, 定义生成日志文件名的逻辑
const pad = num => (num > 9 ? "" : "0") + num;
const generator = () => {
  const date = new Date()
  const month = time.getFullYear() + "" + pad(time.getMonth() + 1);
  const day = pad(time.getDate());
  const hour = pad(time.getHours());
  const minute = pad(time.getMinutes());
  return `${month}/${month}${day}-${hour}${minute}.log`;
};

const rfs = require("rotating-file-stream");
const stream = rfs.createStream(generator, {
  size: "10M",
  interval: "30m"
});
```

### dotenv

  Dotenv is a zero-dependency module that loads environment variables from a **.env** file into **process.env**

```js
const dotenv = require('dotenv')
dotenv.config()
// process.env now has the keys and values you defined in your .env file.
console.log(process.env)

// --------- parsing ----------
const buf = Buffer.from('BASIC=basic')
const config = dotenv.parse(buf)
console.log(typeof config, config) // object { BASIC : 'basic' }

// 配置路径
require('dotenv').config({
  path: path.resolve(process.cww(), '.env')
})
// 多个环境变量路径
require('dotenv').config({
  path: ['.env', '.env.production']
})
```

### cross-env

  Runs scripts that set and use environment variables across platforms

```shell
npm install --save-dev cross-env
```

```json
{
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
  }
}
```

  The **cross-env** module expose two bins: **cross-env** and **cross-env-shell**.

### express-validator

  Express middleware for the validator module.

```shell
npm install express-validator
```

  check()
  The **check()** function is the main API used for validating and sanitizing HTTP requests with express-validator.

```js
import { check } from 'express-validator';
check(fields?: string | string[], message?: string)

// 验证错误
import { validationResult, query } from 'express-validator';
app.post('/hello', query('person').notEmpty(), (req, res) => {
  const result = validationResult(req)
  // result to figure out if the request is valid of not
});

// 自定义验证
app.post(
  '/create-user',
  body('email').custom(async value => {
    // 判断用户是否已经注册
    const user = await UserCollection.findUserByEmail(value);
    if (user) {
      throw new Error('E-mail already in use');
    }
  }),
  (req, res) => {
    // Handle the request
  },
);

// ----- 当body中有多个参数需要校验时 -------------
const validate = validations => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
    }
    next();
  };
};
app.post('/sign', validate([
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
]), async (req, res, next) => {
  const user = await User.create({ ... });
})
```

### Express-rate-limit

  Basic IP rate-limiting middleware for Express. Use to limit repeated requests to public APIs and/or endpoints
  such as password reset.

[morgan](https://www.npmmirror.com/package/morgan)

[helmet](https://www.npmmirror.com/package/helmet)

[compression](https://www.npmmirror.com/package/compression)

[express中文官网](https://www.expressjs.com.cn/)

[rotating-file-stream](https://www.npmmirror.com/package/rotating-file-stream)

[dotenv](https://www.npmmirror.com/package/dotenv)

[Twelve-Factor](https://12factor.net/config)

[cross-env](https://www.npmmirror.com/package/cross-env)

[express-validator](https://express-validator.github.io/docs/)

[Express中间件列表](https://www.expressjs.com.cn/resources/middleware.html)

[Express-rate-limit](https://www.npmmirror.com/package/express-rate-limit)
