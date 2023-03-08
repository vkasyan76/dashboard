import express from 'express'
import { getAdmins, getUserPerformance } from '../controllers/management.js'

const router = express.Router()

router.get('/admins', getAdmins)

router.get('/performance/:id', getUserPerformance)

// router.get('/performance/:id', (req, res) => {
//   console.log('GET /performance/:id')
//   getUserPerformance(req, res)
// })

export default router
