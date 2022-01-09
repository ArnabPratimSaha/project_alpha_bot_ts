import { MessageModel } from "../database/message";
import { Message, MessageStatus } from "../interface and enum/schema";

const changeMessageStatus=async(message:Message,status:MessageStatus)=>{
    try {
        if(message.status===status)return;
        await MessageModel.findOneAndUpdate({messageId:message.messageId},{ $set:{status:status} });
    } catch (error) {
        console.log(error);
        return;
    }
}
export {changeMessageStatus}