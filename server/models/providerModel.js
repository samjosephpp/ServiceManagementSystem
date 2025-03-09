const mongoose = require('mongoose');
const { masterSchema } = require('./masterModels')

const ProviderSchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: String,
    code: String,
    isActive: Boolean,
    stateId: { type: mongoose.Schema.Types.ObjectId , ref: 'State' },
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    isApproved: Boolean,
    email: String,
    phone: String
}); //, { timestamps: true }

const ProviderServiceSchema = new mongoose.Schema({
    ...masterSchema.obj,
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    serviceCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory' },
    availability: Boolean,
    rate: Number,
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    isApproved: Boolean,
    isActive: Boolean,
    description: String
});     //, { timestamps: true }


module.exports = {
    Provider: mongoose.model('Provider', ProviderSchema),
    ProviderService: mongoose.model('ProviderService', ProviderServiceSchema)
}