const registrationPendingService = require('../services/registrationPending.js');
const tokenGenerate = require('../helpers/tokenGenerate.js')
const sendEmail = require('../helpers/sendEmail.js')
const {ctrlWrapper} = require("../helpers");

    const getAllPendingRegistration = async(req, res) => {
        try {
            const limit = parseInt(req.query.limit);
            const pendingRegistrations = await registrationPendingService.getAllPendingRegistration(limit);

            return res.json(pendingRegistrations);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    const deletePending = async (req, res) => {
        await registrationPendingService.deleteById(req.params.id)
        res.status(201).json({
            msg: "Deleted at id" + req.params.id
        })
    }
    const createNewPendingRegistration = async (req, res) => {

        const token = tokenGenerate()
        const { email, name } = req.body;
        const data = {
            to: email,

            subject: 'Medical Center Registration',

            html: '<p>Dear ' + name +'</p>' +
                '<br/>' + '<p>You were provided a token by your organization</p>' +
                '<br/>' + '<p>Procced by <a href="http://localhost:4200/token" style="color: black">this link</a> to start registration procces</p>' +
                'Your token is <strong> ' + token + '</strong>'
        }

        const pendingRegistration = await registrationPendingService.createPending(email, name, token)

        sendEmail(data).then(r => console.log(r))
        res.status(201).json({
            email: pendingRegistration.email,
            name: pendingRegistration.name,
        });
    }

    const checkForToken = async (req, res) => {
        let invite = await registrationPendingService.findByEmail(req.query.email)
        if (invite) {
            if(invite.token === req.query.token){
                return res.status(201).json({
                    invite: invite,
                    isValid: true,
                    msg: 'Registration Allowed'
                })
            }else{
                res.status(401).json('Invitation not found')
            }
        }
    }

module.exports = {
    createNewPendingRegistration: ctrlWrapper(createNewPendingRegistration),
    getAllPendingRegistration: ctrlWrapper(getAllPendingRegistration),
    checkForToken: ctrlWrapper(checkForToken),
    delete: ctrlWrapper(deletePending)
};