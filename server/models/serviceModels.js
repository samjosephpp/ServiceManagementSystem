const mongoose = require('mongoose');
const { masterSchema } = require('./masterModels')

const ServiceRequestSchema = new mongoose.Schema({
    ...masterSchema.obj,
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' , required: true },
    providerServiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProviderService'  , required: true},
    status: { type: String, enum: ['Pending', 'Accepted', 'Declined', 'Completed'], default: 'Pending' },
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State' , required: true},
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location'  , required: true },
    address: {type :String,  required: true},
    remarks: {type: String},
    isPaid: {type: Boolean, default: false},
    amount: Number
}); //, { timestamps: true }

const ServiceLogSchema = new mongoose.Schema({
    ...masterSchema.obj,
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest' },
    log: String,
    status: String
}); //, { timestamps: true }

const PaymentSchema = new mongoose.Schema({
    ...masterSchema.obj,
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest' },
    amount: Number,
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    paymentDate: Date
}); //, { timestamps: true }

const FeedbackSchema = new mongoose.Schema({
    ...masterSchema.obj,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest' },
    rating: Number,
    comment: String
});     //, { timestamps: true }


module.exports = {
    ServiceRequest: mongoose.model('ServiceRequest', ServiceRequestSchema),
    ServiceLog: mongoose.model('ServiceLog', ServiceLogSchema),
    Payment: mongoose.model('Payment', PaymentSchema),
    Feedback: mongoose.model('Feedback', FeedbackSchema)
}