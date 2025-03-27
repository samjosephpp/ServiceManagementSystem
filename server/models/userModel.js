const mongoose = require('mongoose');
const { masterSchema } = require('./masterModels')

// const UserSchema0 = new mongoose.Schema({
//     ...masterSchema.obj,
//     name: {type: String, required:true},
//     password: {type: String, required:true},
//     email: {type: String, required:true},
//     roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
//     phone: String,
//     stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
//     locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
//     isActive: {type:Boolean, default: true},
//     userType: { type: String, enum: ['Admin', 'Client', 'ServiceProvider'], default: 'Client' },
//     clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
//     providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' }
// });     ///, { timestamps: true }

const UserSchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    // role: { type: String, enum: ['Admin', 'Client', 'ServiceProvider'], default: 'Client' },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    phone: String,
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    isActive: { type: Boolean, default: true },
    userType: { type: String, enum: ['Admin', 'Client', 'ServiceProvider'], default: 'Client' },
    clientId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Client',
        // required: function () {
        //     return this.role = "Client";
        // },
        default: null
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Provider',
        // required: function () {
        //     return this.role = "ServiceProvider";
        // },
        default: null
    }
});


const RoleSchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: { type: String, required: true },
    description: String,
    enabled: { type: Boolean, default: true }
});     ///, { timestamps: true }

module.exports = {
    User: mongoose.model('User', UserSchema),
    Role: mongoose.model('Role', RoleSchema)
}