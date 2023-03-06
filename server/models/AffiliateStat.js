import mongoose from 'mongoose'

const AffiliateStatSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    affiliateSales: {
        type: [mongoose.Types.ObjectId],
        ref: 'Transaction',
    },
}, { timestamps: true }, )

const AffilaiteStat = mongoose.model('Affiliate', AffiliateStatSchema)
export default AffilaiteStat