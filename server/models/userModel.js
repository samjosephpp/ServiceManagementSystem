const mongoose = require('mongoose');
const { masterSchema } = require('./masterModels')

const UserSchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: String,
    password: String,
    email: String,
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    phone: String,
    stateId: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    isActive: Boolean,
    userType: { type: String, enum: ['Admin', 'Client', 'ServiceProvider'], default: 'Client' },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' }
});     ///, { timestamps: true }

const RoleSchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: String,
    description: String,
    enabled: Boolean
});     ///, { timestamps: true }

module.exports = {
    User: mongoose.model('User', UserSchema),
    Role: mongoose.model('Role', RoleSchema)
}