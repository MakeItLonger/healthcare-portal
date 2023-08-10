const registrationPendingData = require('../data/registrationPending.js');
const doctorData = require("../data/doctors");

class RegistrationPendingService {


    async deleteById(id){
        return await registrationPendingData.deleteById(id)
    }

    async deleteByEmail(email){
        if(!email){
            throw new Error('Email is required')
        }

        return registrationPendingData.deleteByEmail(email)
    }
    async getAllPendingRegistration(limit) {
        if (limit) {
            return await registrationPendingData.getLimitedPendingRegistrations(limit);
        }

        return await registrationPendingData.getAllPendingRegistrations();
    }

    async createPending(email, name, token) {

        const newPending = await registrationPendingData.create({
            email,
            name,
            token
        });

        return {
            email: newPending.email,
            name: newPending.name,
        };
    };

    async findByEmail(email) {
        return await registrationPendingData.findByEmail(email)
    }
}

module.exports = new RegistrationPendingService();