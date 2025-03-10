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
     }
     //, isActive : { type : Boolean, default: true},

},  { timestamps : false});


const CompanySchema = new mongoose.Schema({
    name: String,
    code: String,
    description: String,
    enabled: Boolean
}, { timestamps: true });

const StateSchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: {type: String, required: true },
    code: {type: String, required: true},
    description: String,
    isActive: {type : Boolean, default : true}
});     //, { timestamps: true }

const LocationSchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: {type: String, required: true },
    isActive:  { type : Boolean, default: true},
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
    pincode: String,
    code: {type: String, required: true }
});     //, { timestamps: true }

const ServiceCategorySchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: {type: String, required: true },
    code: {type: String, required: true },
    isActive:  { type : Boolean, default: true},
    description: String
}); //, { timestamps: true }


module.exports = { 
    masterSchema, 
    Company: mongoose.model('Company', CompanySchema),
    State: mongoose.model('State', StateSchema),
    Location: mongoose.model('Location', LocationSchema),
    ServiceCategory: mongoose.model('ServiceCategory', ServiceCategorySchema)
}