const mongoose = require('mongoose');
const { masterSchema } = require('./masterModels')

const ProviderSchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: {type: String, required: true},
    code: {type: String, required: true},
    isActive: {type: Boolean, default:true},
    stateId: { type: mongoose.Schema.Types.ObjectId , ref: 'State' },
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    address: {type: String, required: true},
    isApproved: {type: Boolean, default:true},
    email: {type: String, required: true},
    phone: {type: String, required: true}
}); //, { timestamps: true }

const ProviderServiceSchema = new mongoose.Schema({
    ...masterSchema.obj,
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    serviceCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory' },
    availability: {type: Boolean, default:true},
    rate: {type: Number, required: true},
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    isApproved: {type: Boolean, default:true},
    isActive: {type: Boolean, default:true},
    description: String
});     //, { timestamps: true }


module.exports = {
    Provider: mongoose.model('Provider', ProviderSchema),
    ProviderService: mongoose.model('ProviderService', ProviderServiceSchema)
}