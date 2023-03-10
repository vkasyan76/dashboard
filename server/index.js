import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import clientRoutes from './routes/client.js'
import generalRoutes from './routes/general.js'
import managementRoutes from './routes/management.js'
import salesRoutes from './routes/sales.js'

// data imports
import User from './models/User.js'
import Product from './models/Product.js'
import ProductStat from './models/ProductStat.js'
import Transaction from './models/Transaction.js'
import OverallStat from './models/OverallStat.js'
import AffilaiteStat from './models/AffiliateStat.js'
import {
  dataUser,
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataOverallStat,
  dataAffiliateStat,
} from './data/index.js'

/* CONFIGURATION */
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('common'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

/* ROUTES */
app.use('/client', clientRoutes)
app.use('/general', generalRoutes)
app.use('/management', managementRoutes)
app.use('/sales', salesRoutes)

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000
// You can also remove the warning by setting the strictQuery to false. This will suppress the warning and will not affect the current behavior of your queries. (chatGPT)
mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`))

    // generate a unique _id value for each document before inserting it into the collection.
    const dataWithUniqueIds = dataTransaction.map((d) => {
      return {
        ...d,
        _id: new mongoose.Types.ObjectId(),
      }
    })

    // add the data: ONLY ADD THE DATA ONE TIME
    // User.insertMany(dataUser)
    // Product.insertMany(dataProduct)
    // ProductStat.insertMany(dataProductStat)
    // Transaction.insertMany(dataTransaction)
    // replaced with to have  a unique _id value for each document before inserting it into the collection.:
    // Transaction.insertMany(dataWithUniqueIds, (error, docs) => {
    //   if (error) {
    //     console.error(error)
    //   } else {
    //     console.log(`Inserted ${docs.length} documents into the collection`)
    //   }
    // })
    // OverallStat.insertMany(dataOverallStat)
    // AffilaiteStat.insertMany(dataAffiliateStat)
  })
  .catch((error) => console.log(`${error} did not connect`))
