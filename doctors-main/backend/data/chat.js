const chatSchema = require('../models/chat')

class ChatData {
    getChatById(id){
        return chatSchema.findOne({_id: id})
    }

    getChatByUsers(patientId, doctorId){
        return chatSchema.findOne({patient: patientId, doctor: doctorId})
    }

    deleteChat(id){
        return chatSchema.findByIdAndDelete(id)
    }

    createChat(chat){
        return chatSchema.create(chat)
    }

    addMessage(chatId, id, msg){
        return chatSchema.updateOne({_id: chatId}, {$push: {messages: {sender: id, msg: msg}}})
    }
}

module.exports = new ChatData();
