const chatData = require('../data/chat.js');
const doctorData = require("../data/doctors");

class ChatService {

    getChat = async (id) => {
        return chatData.getChatById(id)
    }

    getChatByUsers = async (patient, doctor) => {
        return chatData.getChatByUsers(patient, doctor)
    }

    createChat = async (patient, doctor) => {
        console.log(patient, doctor)
        return await chatData.createChat({patient: patient, doctor: doctor});
    };

    deleteChat = async (id) => {
        return chatData.deleteChat(id)
    }

    addMessage = async (chatId,id, msg) => {
        return chatData.addMessage(chatId, id, msg)
    }
}


module.exports = new ChatService();
