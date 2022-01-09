import {Client,MessageEmbed,Guild,Channel, Role, GuildMember, BaseGuildTextChannel, User} from 'discord.js';
import { Message, MessageStatus, MessageType } from '../interface and enum/schema';
import { changeMessageStatus } from './changeStatus';
const getChannelsFromId=(guild:Guild,query:Array<String>):Array<Channel>=>{
    const validChannels:Array<Channel>=[];
    guild.channels.cache.forEach((channel:Channel)=>{
        if(channel.type==='GUILD_TEXT' && query.includes(channel.id)){
            validChannels.push(channel);
        }
    });
    return validChannels;
}
const getRolessFromId=(guild:Guild,query:Array<String>):Array<Role>=>{
    const validRoles:Array<Role>=[];
    guild.roles.cache.forEach((role:Role)=>{
        if(query.includes(role.id)){
            validRoles.push(role);
        }
    });
    return validRoles;
}
const getGuildMembersFromId=(guild:Guild,query:Array<String>):Array<GuildMember>=>{
    const validMembers:Array<GuildMember>=[];
    guild.members.cache.forEach((member:GuildMember)=>{
        if(query.includes(member.id)){
            validMembers.push(member);
        }
    });
    return validMembers;
}
const getMessage = (title:String, message:String, sender:User) => {
    return `Message created By <@${sender}>\n\n**${title}**\n${message}\n`;
}
const sendMessage=async(client:Client,message:Message):Promise<void> =>{
    try {
        const guild = await client.guilds.fetch(message.targetGuild.toString())
        const embeded = new MessageEmbed();
        embeded.setColor('BLURPLE');
        const user = await client.users.fetch(message.sender.toString());
        embeded.setTitle(`Message Created By **${user.username}** Using VIVI`)
        embeded.setFooter({text:`Created By VIVI`});
        embeded.setTimestamp(new Date());
        const guildMembers = getGuildMembersFromId(guild, message.members || [])
        if (message.type === MessageType.CHANNEL) {
            const validChannels:Array<Channel> = getChannelsFromId(guild,message.channels||[]);
            
            validChannels.forEach(async (c) => {
                if(!(c instanceof BaseGuildTextChannel))return;
                const roles:Array<Role> = getRolessFromId(guild, message.roles||[]);
                try {
                    await c.send({
                        content: `${guildMembers.map(m=>`<@${m.id}> `)} ${roles.map(r=>(r.id!==guild.roles.everyone.id)?`<@&${r.id}> `:`${r.name} `)}\n
                            ${getMessage(message.title, message.message, user)}`,
                        embeds: [embeded]
                    });
                } catch (e) {
                    console.log('could not send a message to channel');//work
                    await changeMessageStatus(message,MessageStatus.CANCELLED);
                }
            })
            await changeMessageStatus(message,MessageStatus.SENT);
        }
        if(message.type===MessageType.DM){
            guildMembers.forEach(async(member:GuildMember)=>{
                await member.send({
                    content: `${getMessage(message.title, message.message, user)}`,
                    embeds: [embeded]
                });
            });
            await changeMessageStatus(message,MessageStatus.SENT);
        }
    } catch (error) {
        
    }
}
export {sendMessage}