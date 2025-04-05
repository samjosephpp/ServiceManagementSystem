const mongoose = require('mongoose');
const { masterSchema } = require('./masterModels')

const ServiceRequestSchema = new mongoose.Schema({
    ...masterSchema.obj,
    requestNumber: { type: String },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    providerServiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProviderService', required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Declined', 'Completed'], default: 'Pending' },
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    address: { type: String, required: true },
    remarks: { type: String },
    isPaid: { type: Boolean, default: false },
    amount: Number,
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment', // Reference to the Payment model
        required: false // Optional if not all service requests have payments
    },
}); //, { timestamps: true }

ServiceRequestSchema.pre('save', function (next) {
    if (this.isNew) {
        this.requestNumber = "REQ" + Date.now() + Math.floor(Math.random() * 10000);
    } else {
        this.requestNumber = this.requestNumber.replace(/\s/g, '').toUpperCase();
    }
    next();
});

const ServiceLogSchema = new mongoose.Schema({
    ...masterSchema.obj,
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest' },
    log: String,
    status: String
}); //, { timestamps: true }

const PaymentSchema = new mongoose.Schema({
    ...masterSchema.obj,
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest' },
    paymentId: { type: String },
    cardType: { type: String, enum: ['Debit', 'Credit', 'GPay', 'ApplePay'], default: 'Credit' },
    cardHolder: { type: String },
    cardNumber : { type: String },
    cardExpiry : { type: String },
    cardccv: { type: String },
    amount: Number,
    paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    paymentDate: Date
}); //, { timestamps: true }

PaymentSchema.pre('save', function (next) {
    if (this.isNew) {
        let prefix = 'PAY';
        switch (this.cardType) {
            case "Debit":
                prefix = prefix + 'DB'
                break;
            case "Credit":
                prefix = prefix + 'CC'
                break;
            case "GPay":
                prefix = prefix + 'GP'
                break;
            case "ApplePay":
                prefix = prefix + 'AP'
                break;
            default:
                prefix = prefix + 'CS'
                break;
        }
        this.paymentId = prefix + '00' + Date.now() + Math.floor(Math.random() * 10000);
    }
    next();
});


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