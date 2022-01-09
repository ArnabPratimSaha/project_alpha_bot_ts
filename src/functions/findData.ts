import {Client} from 'discord.js'
import { MessageModel } from '../database/message';
import { Message, MessageStatus } from '../interface and enum/schema';
import { sendMessage } from './sendMessage';

let time:number;
let timeout: ReturnType<typeof setTimeout> |null = null;

const handleMessageData = async (client:Client) => {
  if (timeout) clearTimeout(timeout);
  try {
    const messageData=await MessageModel.find({status:MessageStatus.PROCESSING});
    let  closestTimeData:Message=messageData[0];
    messageData.forEach(message=>{
        if(message.delivertime<closestTimeData.delivertime ){
            closestTimeData=message;
        }
    })
    if(!closestTimeData)return;
    time = new Date(closestTimeData.delivertime).getTime() - new Date().getTime();
    if (time <= 0) {
      await sendMessage( client,closestTimeData);
      return;
    }
    timeout = setTimeout(async() => {
        await sendMessage( client,closestTimeData);
    }, time);
  } catch (error) {
    console.log(error);
  }
}
export {handleMessageData}