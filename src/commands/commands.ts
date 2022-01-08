import {DMChannel,MessageEmbed,PartialDMChannel,EmbedFooterData} from 'discord.js';
import { Command ,commandInfo} from '../botconfig/botCommands';


const commands= async(channel:DMChannel|PartialDMChannel)=>{
    try {
        const embededMessage=new MessageEmbed();
        embededMessage.setTitle('COMMANDS')
        embededMessage.addField(`Setup The Bot`,`\`${Command.setup}\` to ${commandInfo.get(Command.setup)||''}`);
        embededMessage.addField(`View your log`,`\`${Command.log}\` to ${commandInfo.get(Command.log)||''}`);
        embededMessage.addField(`Request Help`,`\`${Command.help}\` to ${commandInfo.get(Command.help)||''}`);
        embededMessage.addField(`Commands`,`\`${Command.commands}\` to ${commandInfo.get(Command.commands)||''}`);
        embededMessage.addField(`Create a link to start writing messages`,`\`${Command.create}\` to ${commandInfo.get(Command.create)||''}`);
        embededMessage.addField(`A link to bot to your server`,`\`${Command.add}\` to ${commandInfo.get(Command.add)||''}`);
        const footer:EmbedFooterData={
            text:`Created By VIVI`,
        }
        embededMessage.setFooter(footer);
        embededMessage.setTimestamp(new Date());
        embededMessage.setColor('GREEN');
        const response=await channel.send({content:'List of commands',embeds:[embededMessage]});
        return response;
    } catch (error) {
        return null;
    }
}
export {commands}