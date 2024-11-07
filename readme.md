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

  It is important to ensure that Express catches all errors that occur while running route handlers and middleware.

```js
app.get('/', (req, res) => {
  throw new Error('Broken') // Express will catch this on its own
})

app.get('/', function (req, res, next) {
  fs.readFile('/file-does-not-exist', function (err, data) {
    if (err) {
      next(err) // Pass errors to Express.
    } else {
      res.send(data)
    }
  })
})
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

- body()
- cookie()
- header()
- param()
- query()

```js
// 验证错误
import { validationResult, query } from 'express-validator';

// .trim() 会删除字符串的空格
app.post('/hello', query('person').trim().notEmpty(), (req, res) => {
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

- isArray()
- isObject()
- isString()
- notEmpty()
- isEmail()
- isJWT()
- isLength({ min, max })

### Express-rate-limit

  Basic IP rate-limiting middleware for Express. Use to limit repeated requests to public APIs and/or endpoints
  such as password reset.

### connect-mongo

  MongoDB session store for Express and Connect.

```shell
npm install connect-mongo
```

```js
const session = require('express-session')
const MongoStore = require('connect-mongo')

app.use(session({
  // session-options,
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/mongodb',
    autoRemove: 'interval', // 自动删除过期的session
    autoRemoveInterval: 10, // 间隔 10分钟
    // 其他选项
    dbName: 'mongodb', // 数据库名称
    collectionName: 'sessions',   // 集合名称
  });
}))
```

### Mongoose

  Mongoose is a MongoDB object modeling tool designed to work in asynchronous environment.

```js
const mongoose = require('mongoose')
// 连接数据库
await mongoose.connect('mongodb://127.0.0.1:17017/test', {
  autoIndex: false,
  autoCreate: false,
  serverSelectionTimeoutMS: 30 * 1000,
  /**
   * If you call mongoose.connect() when your standalone MongoDB server is down, your mongoose.connect() call
   * will only throw an error after 30 seconds
  */
})

// connection events
mongoose.connection.on('connected', () => console.log('connected'));
mongoose.connection.on('open', () => console.log('open'));
mongoose.connection.on('disconnected', () => console.log('disconnected'));
mongoose.connection.on('reconnected', () => console.log('reconnected'));
mongoose.connection.on('disconnecting', () => console.log('disconnecting'));
mongoose.connection.on('close', () => console.log('close'));
```

#### Schema

  Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.

```js
const { Schema } = mongoose

const blogSchema = new Schema({
  title: String,    // shorthand for { type: String }
  author: String,
  body: String,
  isPublished: {
    type: Boolean,
    required: true
  },
  comments: [
    {
      body: String
      date: Date
    }
  ],
  tags: {
    type: [String],
    index: true // MongoDB supports secondary indexes. Disable automatically calls *createIndex* in production
  }
  // ...
});

const personSchema = new Schema({
  name: {
    first: String
    last: String
  },
  author: {
    type: ObjectId,
    ref: Person
  }
}, {
  virtuals: { // 类似于 Vue computed计算属性
    fullName: {
      get () {
        return this.name.firstName + ' ' + this.name.last;
      },
      set (v) {
        this.name.first = v.substr(0, v.indexOf(' '));
        this.name.last = v.substr(v.indexOf(' ') + 1);
      }
    }
  },
  timestamps: {
    createAt: 'created_at',
    updatedAt: 'updated_at'
  },
  selectPopulatedPaths: true
})
```

  If you use *toJSON()* or *toObject()* mongoose will not include virtuals by default. Pass *{ virtuals: true }*

```js
doc.toObject({ virtuals: true });
// Equivalent:
doc.toJSON({ virtuals: true });
```

  To use our schema definition, we need to convert out blogSchema into a Model we can work with.

  An instance of model is called a document.
  
```js
const Blog = mongoose.model('Blog', blogSchema)
// 数据库会自动创建一个 blogs集合
// Mongoose lets you start using your models immediately, without waiting for mongoose to establish a connection
// to MongoDB.

/**
 * When you create a new document with the automatically added )id property, Mongoose creates a new _id
 * of type ObjectId to your document.
*/
const doc = new Blog()
doc._id instanceof mongoose.Types.ObjectId
```

#### Statics

  You can also add static functions to your model.

- Add a function property to the second argument of the schema-constructor

- Add a function property to **schema.statics**

- Call the **Schema#static()** function

```js
const animalSchema = new Schema({ name: String, type: String },
  {
    statics: {
      findByName(name) {
        return this.find({ name: new RegExp(name, 'i') });
      }
    }
  });

animalSchema.statics.findByName = function(name) {
  return this.find({ name: new RegExp(name, 'i') });
};
animalSchema.static('findByBreed', function(breed) { return this.find({ breed }); })
```

#### SchemeType

- String
- Number
- Date
- Buffer
- Boolean
- Mixed
- ObjectId
- Array
- Map
- Schema
- UUID
- BigInt

```js
const schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    index: true
  },
  type: {
    type: String, // 如果想要定义一个字段为type
    lowercase: true, // if you want to lowercase a string before saving
    required: true, // if true adds a required validator for this property
    default: 'hello', // function is also work, the return value of the function is used as the default
    validate: () => {},
    get: () {
    },
    set () {
    }
  },
})

const blog = new mongoose.Schema({
  // String
  title: {
    type: String,
    lowercase: true,
    uppercase: true,
    trim: true,
    enum: [],
    minLength: 10,
    maxLength: 10,
  },
  // Number
  age: {
    type: Number,
    min: 10,
    max: 100,
    enum: []
  },
  // Date
  createdAt: {
    type: Date,
    min,
    max,
    expires
  },
  // ObjectId
  id: mongoose.ObjectId,
  // Boolean
  isPublished: {
    type: Boolean,
    default: 1, // 1 '1' 'true' true, 'yes'
  }
  // Map
  socialMediaHandles: {
    type: Map,
    of: String, // keys are always strings. you specify the type of values using 'of'
  },
  // UUID
  randomId: {
    type: Schema.Types.UUID
  }
})
```

  To create UUIDs, we recommend using Node's built-in UUID generator

```js
const { randomUUID } = require('crypto')
const schema = new mongoose.Schema({
  docId: {
    type: 'UUID',
    default: () => randomUUID()
  }
})
```

  Subdocuments are documents embedded in other documents. Mongoose has two distinct notions of subdocuments:
  array of subdocuments and single nested subdocuments.

```js
const childSchema = new Schema({
  name: String
})

const parentSchema = new Schema({
  children: [childSchema],
  child: childSchema
})
```

  Note that populated documents are not subdocuments in Mongoose. Subdocuments are similar to normal documents.
  The major difference is that subdocuments are not saved individually. they area saved whenever their top-level
  parent document is saved.

```js
const Parent = mongoose.model('Parent', parentSchema);
const parent = new Parent({ children: [{ name: 'Matt' }, { name: 'Sarah' }] });
parent.children[0].name = 'Matthew';

await parent.save()
```

#### Model

```js
const userSchema = new mongoose.Schema({
  name: String,
  password: String
})

const userModel = mongoose.model('user', userSchema)
// 第一个参数是单数形式的集合名.
// mongoose automatically looks for the plural, lowercased version of your model name.

const user = new userModel({
  username: 'hello',
  password: '123456'
})
await user.save()


// query
await userModel.find()
await userModel.findOne({
  username: 'hello'
})
// 删除
await userModel.deleteOne({
  username: 'hello'
})

// 更新
await userModel.updateOne({
  username: 'hello'
}, {
  username: 'word'
})

// 监听
userModel.watch().on('change', () => {
  console.log(data)
})
```

  **ObjectId** is a class, and ObjectIds are objects, When you convert an ObjectId to a string, using toString()

#### Queries

- Model.deleteMany()
- Model.deleteOne()
- Model.find()
- Model.findById()
- Model.findByIdAndDelete()
- Model.findByIdAndRemove()
- Model.findByIdAndUpdate()
- Model.findOne()
- Model.findOneAndDelete()
- Model.findOneAndReplace()
- Model.findOneAndUpdate()
- Model.replaceOne()
- Model.updateMany()
- Model.updateOne()

  A mongoose query can be executed in one of two ways

1. 回调函数
2. .then()

```js
const PersonModel = mongoose.model('Person', personSchema)
const person = await PersonModel.findOne({
  name: 'hello'
});

const query = PersonModel.findOne({
  name: 'hello'
})

// 🈯只返回这两个字段
query.select('name age')
// execute the query at a later time
const person = await query.exec()

// 也可以使用链式调用的语法
await Person.
  find({
    occupation: /host/,
    'name.last': 'Ghost',
    age: { $gt: 17, $lt: 66 },
    likes: { $in: ['vaporizing', 'talking'] }
  }).
  limit(10).
  sort({ occupation: -1 }).
  select({ name: 1, occupation: 1 }).
  exec();
```

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

[Mongoose英文官网](https://mongoosejs.com/docs/guide)

[Awesome-Nodejs](https://github.com/Viure/awesome-nodejs)

[connect-mongo](https://www.npmmirror.com/package/connect-mongo)
