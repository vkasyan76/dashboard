import Product from '../models/Product.js'
import ProductStat from '../models/ProductStat.js'
import User from '../models/User.js'
import Transaction from '../models/Transaction.js'
import getCountryIso3 from 'country-iso-2-to-3'

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()

    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        })
        return {
          ...product._doc,
          stat,
        }
      }),
    )
    res.status(200).json(productsWithStats)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'user' }).select('-password')
    res.status(200).json(customers)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getTransactions = async (req, res) => {
  try {
    // sort should look like this: { "field": "userId", "sort": "desc"}
    const { page = 1, pageSize = 20, sort = null, search = '' } = req.query
    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort)
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = 'asc' ? 1 : -1),
      }
      return sortFormatted
    }

    const sortFormatted = Boolean(sort) ? generateSort() : {}

    // Add this query to check for documents where the cost field is a string
    // Transaction.find({ cost: { $type: 'string' } }, (err, docs) => {
    //   if (err) {
    //     console.error(err)
    //   } else {
    //     console.log(docs)
    //   }
    // })

    // Find documents where the cost field is a string
    // const stringDocs = await Transaction.find({ cost: { $type: 'string' } })
    // console.log(`Found ${stringDocs.length} documents with cost as a string`)

    const transactions = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(search, 'i') } },
        // { cost: { $regex: new RegExp(search + '.*', 'i') } },
        // { cost: { $regex: /^\d+(\.\d+)?$/ } },
        { userId: { $regex: new RegExp(search, 'i') } },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize)
    // const total = await Transaction.countDocuments({
    //   // name: { $regex: search, $options: 'i' },
    //   userId: { $regex: search, $options: 'i' },
    // })

    // ChatGPT: You should modify the search criteria to use a valid field that exists in the schema. In your case, you could modify the search criteria to use the userId or cost fields instead of name:
    const total = await Transaction.countDocuments({
      $or: [
        { userId: { $regex: search, $options: 'i' } },
        { cost: { $regex: search, $options: 'i' } },
      ],
    })

    // console.log('Code made it past try-catch block')
    // Add this line

    res.status(200).json({ transactions, total })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getGeography = async (req, res) => {
  try {
    const users = await User.find()

    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryIso3(country)
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0
      }
      acc[countryISO3]++
      return acc
    }, {})

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count }
      },
    )

    res.status(200).json(formattedLocations)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
