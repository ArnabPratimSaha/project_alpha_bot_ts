import { CommandInteraction, GuildMemberRoleManager, Interaction ,Permissions} from "discord.js";
import { GuildModel } from "../database/guild";

const add=async(interaction:CommandInteraction):Promise<void>=>{
    try {
        if(!interaction.inGuild()){
            await interaction.reply({
                content:'This commands can only be used in a server.'
            })
            return;
        }
        const guildData= await GuildModel.findOne({guildID:interaction.guildId})
        if(!guildData)return;
        if(!(interaction.member.roles instanceof GuildMemberRoleManager)|| !(interaction.member.permissions instanceof Permissions)){
            throw new Error('roles can not be processed')
        }
        if(!interaction.member.roles.cache.find(r=>r.id===guildData.roleID) || !interaction.member.permissions.has('ADMINISTRATOR') ){
            await interaction.reply({
                content:'You dont have access to view the user',
                ephemeral:true
            })
            return;
        }
        if(!interaction.options.get('member'))throw new Error('member field missing')
        const guild=await interaction.guild?.fetch();
        if(!guild){
            throw new Error('guild not found')
        }
        const data= interaction.options.get('member');
        if(!data || !data.value){
            await interaction.reply({
                content:`null value`,
                ephemeral:true
            })
            return;
        }
        if(guildData.validMembers.find(v=>v===data.value)){
            await interaction.reply({
                content:`member <@${data.value}> already added`,
                ephemeral:true
            })
            return;
        }else{
            const viviRole=guild.roles.cache.find(r=>r.id===guildData.roleID);
            guildData.validMembers.push(data.value.toString());
            const member=interaction.guild?.members.cache.find(m=>m.id===data.value);
            if(!member)throw new Error('member can not be processed');
            const guildMember=await member.fetch();
            const role=interaction.guild?.roles.cache.find(r=>r.id===guildData.roleID);
            if(!role)throw new Error('role can not be processed');
            if(!guild.me?.permissions.has('MANAGE_ROLES')){
                await interaction.reply({
                    content:`VIVI does not have access to change roles`,
                    ephemeral:true
                })
                return;
            }
            try {
                const roleMember=await guildMember.roles.add(role);
                if(roleMember.roles.cache.find(r=>r.id===guildData.roleID)){
                    await guildData.save();
                    await interaction.reply({
                        content:`member <@${data.value}> successfully added to the list`,
                        ephemeral:true
                    })
                    return;
                }
            } catch (error) {
                await guildData.save();
                await interaction.reply({
                    content:`member <@${data.value}> successfully added to the list.\nBut ${viviRole?.name} can not be assigned`,
                    ephemeral:true
                })
                return;
            }
            throw new Error('somthing went wrong')
        }
    } catch (error) {
        throw error;
    }
}
export {add}