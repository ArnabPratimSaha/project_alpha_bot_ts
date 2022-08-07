import {Guild} from 'discord.js';
import { ROLE } from '../botconfig/role';
import { GuildModel } from '../database/guild';
const guildJoin = async (guild:Guild) => {
    try {
        const guildData = await GuildModel.findOne({ guildID: guild.id });
        if (guildData) {
            guildData.status = true;
            guildData.guildName = guild.name;
            guildData.guildID = guild.id;
            guildData.guildAvater=guild.iconURL()||'';
            guildData.isPartnered = guild.partnered;
            guildData.guildMemberCount = guild.approximateMemberCount||0;
            const roleId:String=new String(guildData.roleID||'');
            const role = await guild.roles.fetch(roleId.toString());
            if (!role) {
                
                const newRole = await guild.roles.create({
                    name: ROLE.ROLE_NAME,
                    color:ROLE.ROLE_COLOR,
                    reason: 'role created for the user to be able to use the bot',
                });
                guildData.roleID = newRole.id;
            }
            await guildData.save();
            return;
        }
        const role = await guild.roles.create({
            name: ROLE.ROLE_NAME,
            color: ROLE.ROLE_COLOR,
            reason: 'role created for the user to be able to use the bot',
        });
        const newGuild = new GuildModel({
            guildName: guild.name,
            guildID: guild.id,
            roleID: role.id,
            guildAvater: guild.iconURL(),
            guildMemberCount:guild.approximateMemberCount||0,
            isPartnered:guild.partnered,
            validMembers: [],
            status:true
        })
        await newGuild.save();
    } catch (error) {
        console.log(error);
    }
}
export {guildJoin}