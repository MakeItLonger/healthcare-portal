const chatService = require ('../services/chat')
const { ctrlWrapper } = require('../helpers');
const doctorService = require('../services/doctors')
const patientService = require('../services/patients')

const getChat = async (req, res) => {
    const chatId = req.params.id
    const chat = await chatService.getChat(chatId)
    return res.status(200).json(chat)
}

const deleteChat = async (req, res) => {
    const chatId = req.params.id
    await chatService.deleteChat(chatId)
    return res.status(200).json("deleted at id: " + chatId)
}

const createChat = async (req, res) => {
    const {patient, doctor} = req.body
    const chat = await chatService.getChatByUsers(patient, doctor)
    console.log(chat)
    if(chat){
        return res.status(200).json({
            msg: "chat already exist",
            id: chat._id
        })
    }

    const newChat = await chatService.createChat(patient, doctor)

    let patientName = await patientService.getPatientById(patient)
    let doctorName = await doctorService.getDoctorById(doctor)

    await patientService.addChat(patient, newChat._id, doctorName.first_name +" " + doctorName.second_name)

    await doctorService.addChat(doctor, newChat._id, patientName.name)

    return res.status(200).json({
        msg: 'chat created',
        id: newChat._id
    })
}


module.exports = {
    getChat: ctrlWrapper(getChat),
    delete: ctrlWrapper(deleteChat),
    createChat: ctrlWrapper(createChat)
};