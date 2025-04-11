const mongoose = require('mongoose');
const { masterSchema } = require('./masterModels')

const ProviderSchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: {type: String, required: true},
    code: {type: String}, // , required: true
    isActive: {type: Boolean, default:true},
    stateId: { type: mongoose.Schema.Types.ObjectId , ref: 'State' },
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    address: {type: String, required: true},
    isApproved: {type: Boolean, default:true},
    email: {type: String, required: true},
    phone: {type: String, required: true}
}); //, { timestamps: true }

ProviderSchema.pre('save', function(next) { 
    // this.code = this.name.replace(/\s/g, '').toUpperCase();
    if(this.isNew) {
        this.code = "SP" +  Date.now() + Math.floor(Math.random() * 100000);
    // }   this.code = "SP" +  Math.floor(Math.random() * 100000);
    }
    next();
})

const ProviderServiceSchema = new mongoose.Schema({
    ...masterSchema.obj,
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    serviceCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory' },
    // availability: {type: Boolean, default:true},
    // availability : {type: String, enum: ['24 Hours', '7 Days', '5 Days','On Call', 'Emergency Only', 'Rescue'], default: '24 Hours'},
    availabilityDays: {type: String, enum: ['Weekdays', 'Weekends', 'Both'], default: 'Both'},
    availabilityHours: {type: String, enum: ['24 Hours', 'Day Time', 'Night Time'], default: '24 Hours'},
    availabilityTime: {type: String , enum: ['08:00 - 17:00', '00:00 - 23:59'], default: '00:00 - 23:59'},
    availabiltyFor : {type: String, enum: ['15 Min', '30 Min', '45 Min','1 Hr', '1 Hr 30 Min', '2 Hr', '2 Hr 30 Min', '3 Hr', '3 Hr 30 Min'], default: '1 Hr'},
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