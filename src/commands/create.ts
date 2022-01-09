import {DMChannel,PartialDMChannel,User,MessageEmbed,EmbedFooterData} from "discord.js";
import { v4 as uuidv4 } from 'uuid';
import { LinkModel } from "../database/link";

const create=async(channel:DMChannel|PartialDMChannel,author:User)=>{
    try {
        await LinkModel.findOneAndDelete({ discordId: author.id });
        const entryId = uuidv4();
        const link = new LinkModel({
            discordId:author.id,
            entryId:entryId,
            entryTime:new Date()
        })
        await link.save();
        const embededMessage=new MessageEmbed();
        embededMessage.setTitle('Link Generated')
        embededMessage.setURL(`${process.env.FRONTENDAPI}val/${author.id}/${entryId}/dashboard`);
        embededMessage.setColor('BLUE')
        embededMessage.setImage('https://lh3.googleusercontent.com/pw/AM-JKLVp-A0OhVBY8tExBYtSWDhmTFQAuHyrcOKFwe6sfG_fD6b4J3dfK_egegS9Se-NdbQKPLztF5jqgG6yjTNrDhN07RbDY-cdFIzBq0Begd7rgQlXHHKd3S6eLfzghfgQBppNQjm-GDqJvUHVBrDT2CY=w1484-h748-no?authuser=0');
        const footer:EmbedFooterData={
            text:`Created By VIVI`,
        }
        embededMessage.setFooter(footer);
        embededMessage.setTimestamp(new Date());
        embededMessage.addField('Link',`A link has been generated for you\nGo to [VIVI](${process.env.FRONTENDAPI}val/${author.id}/${entryId}/dashboard) to create your massage\nLink will expire in ${10} min`);
        embededMessage.addField('Warning',`**DO NOT SHARE THIS LINK WITH OTHERS**`);
        const response=await channel.send({content:`Generated A link \n${process.env.FRONTENDAPI}val/${author.id}/${entryId}/dashboard`, embeds:[embededMessage] });
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}
export {create};