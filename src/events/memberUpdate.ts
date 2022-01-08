import {PartialGuildMember,GuildMember} from "discord.js"
import { GuildModel } from "../database/guild";

const memberUpdate =async (oldMember:PartialGuildMember|GuildMember, newMember:PartialGuildMember|GuildMember) => {
    try {
        const guild = newMember.guild;
        const guildData = await GuildModel.findOne({ guildID: guild.id });
        const oldRole=oldMember.roles.cache.find(role=>role.id===guildData?.roleID);
        const newRole=newMember.roles.cache.find(role=>role.id===guildData?.roleID);
        if (!oldRole && newRole)//assigned the vivi role
        {
            guildData?.validMembers.push(newMember.id);
            await guildData?.save();
        }
        if (oldRole && !newRole)//removed the VIVI role
        {
            if(guildData?.validMembers){
                guildData.validMembers = guildData?.validMembers.filter(m => m !== newMember.id);
            }
            await guildData?.save();
        }
    } catch (error) {
        console.log(error);
    }
}
export {memberUpdate}