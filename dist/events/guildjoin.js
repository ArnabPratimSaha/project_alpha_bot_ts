"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guildJoin = void 0;
const role_1 = require("../botconfig/role");
const guild_1 = require("../database/guild");
const guildJoin = (guild) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const guildData = yield guild_1.GuildModel.findOne({ guildID: guild.id });
        if (guildData) {
            guildData.status = true;
            guildData.guildName = guild.name;
            guildData.guildID = guild.id;
            guildData.guildAvater = guild.iconURL() || '';
            guildData.isPartnered = guild.partnered;
            guildData.guildMemberCount = guild.approximateMemberCount || 0;
            const roleId = new String(guildData.roleID || '');
            const role = yield guild.roles.fetch(roleId.toString());
            if (!role) {
                const newRole = yield guild.roles.create({
                    name: role_1.ROLE.ROLE_NAME,
                    color: role_1.ROLE.ROLE_COLOR,
                    reason: 'role created for the user to be able to use the bot',
                });
                guildData.roleID = newRole.id;
            }
            yield guildData.save();
            return;
        }
        const role = yield guild.roles.create({
            name: role_1.ROLE.ROLE_NAME,
            color: role_1.ROLE.ROLE_COLOR,
            reason: 'role created for the user to be able to use the bot',
        });
        const newGuild = new guild_1.GuildModel({
            guildName: guild.name,
            guildID: guild.id,
            roleID: role.id,
            guildAvater: guild.iconURL(),
            guildMemberCount: { type: Number },
            isPartnered: guild.partnered,
            validMembers: [],
            status: true
        });
        yield newGuild.save();
    }
    catch (error) {
        console.log(error);
    }
});
exports.guildJoin = guildJoin;
