const mongoose = require('mongoose');

const masterSchema = new mongoose.Schema({

    createdAt: { type : Date, default : Date.now},
    createdBy : { type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        // required: function() {
        //     return this.role != "admin";
        // }
     },
     updatedAt : { type: Date, default : Date.now},
     UpdatedBy : {type : mongoose.Schema.Types.ObjectId ,
        ref: "User"
     },
     isActive : { type : Boolean, default: true},

},  { timestamps : false});


const CompanySchema = new mongoose.Schema({
    name: String,
    code: String,
    description: String,
    enabled: Boolean
}, { timestamps: true });

const StateSchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: String,
    code: String,
    description: String,
    isActive: Boolean
});     //, { timestamps: true }

const LocationSchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: String,
    isActive: Boolean,
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
    pincode: String,
    code: String
});     //, { timestamps: true }

const ServiceCategorySchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: String,
    code: String,
    isActive: Boolean,
    description: String
}); //, { timestamps: true }


module.exports = { 
    masterSchema, 
    Company: mongoose.model('Company', CompanySchema),
    State: mongoose.model('State', StateSchema),
    Location: mongoose.model('Location', LocationSchema),
    ServiceCategory: mongoose.model('ServiceCategory', ServiceCategorySchema)
}