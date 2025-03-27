const mongoose = require('mongoose');
const { masterSchema } = require('./masterModels')

const ClientSchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: { type: String, required: true },
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    email: { type: String, required: true },
    phone: String,
    isActive: { type:Boolean , default: true },
    description: String
}); // , { timestamps: true }

module.exports = {
    Client: mongoose.model('Client', ClientSchema)
}