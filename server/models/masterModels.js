const mongoose = require('mongoose');

const masterSchema = new mongoose.Schema({

    createdAt: { type : Date, default : Date.now},
    createdBy : { type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        // required: function() {
        //     return this.role != "Admin";
        // }
     },
     updatedAt : { type: Date, default : Date.now},
     updatedBy : {type : mongoose.Schema.Types.ObjectId ,
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
    code: {type: String   },  //required: true, default: " " 
    description: String,
    isActive: {type : Boolean, default : true}
});     //, { timestamps: true }
// Pre-save hook to generate unique state code
StateSchema.pre('save', function(next) {
    if(this.isNew){         // && (!this.code || this.code.trim() === "")
        // console.log("StateSchema pre save");
        this.code = "ST"+ Date.now() + Math.floor(Math.random() * 1000);
    }    
    next();
});


const LocationSchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: {type: String, required: true },
    isActive:  { type : Boolean, default: true},
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true },
    pincode: String,
    code: {type: String } //, required: true
});     //, { timestamps: true }
// Pre-save hook to generate unique Location code
LocationSchema.pre('save', function(next) {
    if(this.isNew){
        this.code = "L00"+ Date.now() + Math.floor(Math.random() * 100);
    }
    next();   
});

const ServiceCategorySchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: {type: String, required: true },
    code: {type: String, required: true },
    isActive:  { type : Boolean, default: true},
    description: String
}); //, { timestamps: true }
// Pre-save hook to generate unique Location code
// ServiceCategorySchema.pre('save', function(next) {
//     if( this.isNew && !code){
//         const timestamp =  Date.now();
//         const ts  = Date.now().timestamps;         
//         this.code = `SC0${timestamp}`
//     }
// });

module.exports = { 
    masterSchema, 
    Company: mongoose.model('Company', CompanySchema),
    State: mongoose.model('State', StateSchema),
    Location: mongoose.model('Location', LocationSchema),
    ServiceCategory: mongoose.model('ServiceCategory', ServiceCategorySchema)
}