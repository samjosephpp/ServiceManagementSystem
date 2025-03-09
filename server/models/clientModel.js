const mongoose = require('mongoose');
const { masterSchema } = require('./masterModels')

const ClientSchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: String,
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    email: String,
    phone: String,
    isActive: Boolean,
    description: String
}); // , { timestamps: true }

module.exports = {
    Client: mongoose.model('Client', ClientSchema)
}