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
exports.add = void 0;
const discord_js_1 = require("discord.js");
const guild_1 = require("../database/guild");
const add = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        if (!interaction.inGuild()) {
            yield interaction.reply({
                content: 'This commands can only be used in a server.'
            });
            return;
        }
        const guildData = yield guild_1.GuildModel.findOne({ guildID: interaction.guildId });
        if (!guildData)
            return;
        if (!(interaction.member.roles instanceof discord_js_1.GuildMemberRoleManager) || !(interaction.member.permissions instanceof discord_js_1.Permissions)) {
            throw new Error('roles can not be processed');
        }
        if (!interaction.member.roles.cache.find(r => r.id === guildData.roleID) || !interaction.member.permissions.has('ADMINISTRATOR')) {
            yield interaction.reply({
                content: 'You dont have access to view the user',
                ephemeral: true
            });
            return;
        }
        if (!interaction.options.get('member'))
            throw new Error('member field missing');
        const guild = yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.fetch());
        if (!guild) {
            throw new Error('guild not found');
        }
        const data = interaction.options.get('member');
        if (!data || !data.value) {
            yield interaction.reply({
                content: `null value`,
                ephemeral: true
            });
            return;
        }
        if (guildData.validMembers.find(v => v === data.value)) {
            yield interaction.reply({
                content: `member <@${data.value}> already added`,
                ephemeral: true
            });
            return;
        }
        else {
            const viviRole = guild.roles.cache.find(r => r.id === guildData.roleID);
            guildData.validMembers.push(data.value.toString());
            const member = (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.members.cache.find(m => m.id === data.value);
            if (!member)
                throw new Error('member can not be processed');
            const guildMember = yield member.fetch();
            const role = (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.roles.cache.find(r => r.id === guildData.roleID);
            if (!role)
                throw new Error('role can not be processed');
            if (!((_d = guild.me) === null || _d === void 0 ? void 0 : _d.permissions.has('MANAGE_ROLES'))) {
                yield interaction.reply({
                    content: `VIVI does not have access to change roles`,
                    ephemeral: true
                });
                return;
            }
            try {
                const roleMember = yield guildMember.roles.add(role);
                if (roleMember.roles.cache.find(r => r.id === guildData.roleID)) {
                    yield guildData.save();
                    yield interaction.reply({
                        content: `member <@${data.value}> successfully added to the list`,
                        ephemeral: true
                    });
                    return;
                }
            }
            catch (error) {
                yield guildData.save();
                yield interaction.reply({
                    content: `member <@${data.value}> successfully added to the list.\nBut ${viviRole === null || viviRole === void 0 ? void 0 : viviRole.name} can not be assigned`,
                    ephemeral: true
                });
                return;
            }
            throw new Error('somthing went wrong');
        }
    }
    catch (error) {
        throw error;
    }
});
exports.add = add;
