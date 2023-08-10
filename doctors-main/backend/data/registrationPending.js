const PendingRegistration = require('../models/regestrationPending.js');
const doctorData = require("./doctors");

class  registrationPendingData{

    async deleteById(id){
        return PendingRegistration.deleteOne({_id: id})
    }

    async deleteByEmail(email){
        return PendingRegistration.deleteOne({email: email})
    }
    async getAllPendingRegistrations() {
        return PendingRegistration.find();
    }

    async getLimitedPendingRegistrations(limit) {
        return PendingRegistration.find({}).limit(limit);
    }

    async create(pendingRegistration) {
        return new PendingRegistration(pendingRegistration).save();
    }

    async findByEmail(email){
        console.log(email)
        return PendingRegistration.findOne({email});
    }

}

module.exports = new registrationPendingData();