import { CommandInteraction, GuildMemberRoleManager, Interaction } from "discord.js";
import { GuildModel } from "../database/guild";

const view=async(interaction:CommandInteraction):Promise<void>=>{
    try {
        if(!interaction.inGuild()){
            await interaction.reply({
                content:'This commands can only be used in a server.'
            })
            return;
        }
        
        const guildData= await GuildModel.findOne({guildID:interaction.guildId})
        if(!guildData)return;
        if(!(interaction.member.roles instanceof GuildMemberRoleManager)){
            throw new Error('roles can not be processed')
        }
        if(!interaction.member.roles.cache.find(r=>r.id===guildData.roleID)){
            await interaction.reply({
                content:'You dont have access to view the users'
            })
            return;
        }
        const guild=await interaction.guild?.fetch();
        if(!guild){
            throw new Error('guild not found')
        }
        const members=guild.members.cache.filter(m=>{
            if(guildData.validMembers.includes(m.id))return true;
            return false;
        })
        await interaction.reply({
            content:`**Valid Members**\n${members.map(m=>`<@${m.id}> `)}`,
            ephemeral:true
        })
    } catch (error) {
        throw error;
    }
}
export {view}