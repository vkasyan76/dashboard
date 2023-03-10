import mongoose from 'mongoose'
import User from '../models/User.js'
import Transaction from '../models/Transaction.js'

export const getAdmins = async (req, res) => {
  try {
    // const { id } = req.params
    const admins = await User.find({ role: 'admin' }).select('-password')
    res.status(200).json(admins)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const getUserPerformance = async (req, res) => {
  try {
    const { id } = req.params

    const userWithStats = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'affiliatestats',
          localField: '_id',
          foreignField: 'userId',
          as: 'affiliateStats',
        },
      },

      { $unwind: '$affiliateStats' },
    ])

    // console.log('userWithStats:', userWithStats)

    const saleTransactions = await Promise.all(
      userWithStats[0].affiliateStats.affiliateSales.map((id) => {
        // console.log('Transaction ID:', id)
        return Transaction.findById(id)
      }),
    )

    console.log('saleTransactions:', saleTransactions)

    // Log all transactions:
    // const transactions = await Transaction.find({})
    // console.log('All Transactions:', transactions)

    // const transactionIds = transactions.map((transaction) => transaction._id)

    // console.log('Transaction IDs:', transactionIds)

    // const validTransactions = saleTransactions.filter(
    //   (transaction) => transaction !== null,
    // )
    // console.log('Valid transactions:', validTransactions)

    // console.log(
    //   'userWithStats[0].affiliateStats.affiliateSales:',
    //   userWithStats[0].affiliateStats.affiliateSales,
    // )

    // const saleTransactions = await Promise.all(
    //   userWithStats[0].affiliateStats.affiliateSales.map((id) => {
    //     console.log('Transaction ID:', id)
    //     return Transaction.findById(id).catch((error) => {
    //       console.log(`Error finding transaction with ID ${id}: ${error}`)
    //     })
    //   }),
    // )

    // if (!userWithStats[0]) {
    //   return res.status(404).json({ message: 'User not found' })
    // }

    // const saleTransactions2 = await Transaction.find({
    //   _id: { $in: userWithStats[0].affiliateStats.affiliateSales },
    // })

    // console.log('saleTransactions2', saleTransactions2)

    // const filteredTransactions = saleTransactions.filter(
    //   (transaction) => transaction !== null,
    // )

    // console.log('filteredTransactions:', filteredTransactions)

    const filteredSaleTransactions = saleTransactions.filter(
      (transaction) => transaction !== null,
    )

    // console.log('filteredSaleTransactions:', filteredSaleTransactions)

    res
      .status(200)
      .json({ user: userWithStats[0], sales: filteredSaleTransactions })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
