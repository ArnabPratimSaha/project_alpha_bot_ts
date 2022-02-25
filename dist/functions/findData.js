"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageHandler = void 0;
const message_1 = require("../database/message");
const schema_1 = require("../interface and enum/schema");
const sendMessage_1 = require("./sendMessage");
class MessageHandler {
    constructor() {
        this.handleMessageData = (client) => __awaiter(this, void 0, void 0, function* () {
            let time;
            if (this.timeout)
                clearTimeout(this.timeout);
            try {
                const messageData = yield message_1.MessageModel.find({ status: schema_1.MessageStatus.PROCESSING });
                let closestTimeData = messageData[0];
                messageData.forEach(message => {
                    if (message.delivertime < closestTimeData.delivertime) {
                        closestTimeData = message;
                    }
                });
                if (!closestTimeData)
                    return;
                time = new Date(closestTimeData.delivertime).getTime() - new Date().getTime();
                if (time <= 0) {
                    yield (0, sendMessage_1.sendMessage)(client, closestTimeData);
                    return;
                }
                this.timeout = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield (0, sendMessage_1.sendMessage)(client, closestTimeData);
                }), time);
            }
            catch (error) {
                console.log(error);
            }
        });
        this.timeout = null;
    }
}
exports.MessageHandler = MessageHandler;
