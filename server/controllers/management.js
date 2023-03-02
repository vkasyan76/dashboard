import mongoose from 'mongoose'
import User from '../models/User.js'

export const getAdmins = async (req, res) => {
  try {
    // const { id } = req.params
    const admins = await User.find({ role: 'admin' }).select('-password')
    res.status(200).json(admins)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}
