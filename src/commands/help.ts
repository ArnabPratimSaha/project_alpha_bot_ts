import {DMChannel,PartialDMChannel,MessageEmbed,EmbedFooterData} from 'discord.js';
import { Command } from '../botconfig/botCommands';
const help= async(channel:DMChannel|PartialDMChannel)=>{
    try {
        const embededMessage=new MessageEmbed();
        embededMessage.setURL(`${process.env.FRONTENDAPI}readmore`);
        embededMessage.setColor('GREEN')
        embededMessage.setTitle('HELP')
        embededMessage.addField('Website',`Go to [VIVI](${process.env.FRONTENDAPI}readmore)`);
        embededMessage.addField(Command.commands.toString(),`type **${Command.commands.toString()}** to see the full list of commands`);
        embededMessage.setImage('https://lh3.googleusercontent.com/pw/AM-JKLVp-A0OhVBY8tExBYtSWDhmTFQAuHyrcOKFwe6sfG_fD6b4J3dfK_egegS9Se-NdbQKPLztF5jqgG6yjTNrDhN07RbDY-cdFIzBq0Begd7rgQlXHHKd3S6eLfzghfgQBppNQjm-GDqJvUHVBrDT2CY=w1484-h748-no?authuser=0');
        const footer:EmbedFooterData={
            text:`Created By VIVI`,
        }
        embededMessage.setFooter(footer);
        embededMessage.setTimestamp(new Date());
        embededMessage.setDescription(`**Having any problem?**Go to our website to see how things works and may be you will be able to master everything that VIVI does.`)
        const response=await channel.send({content:'help',embeds:[embededMessage]});
        return response;
    } catch (error) {
        return null;
    }
}
export {help}