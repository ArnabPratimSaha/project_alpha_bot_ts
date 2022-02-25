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
exports.view = void 0;
const discord_js_1 = require("discord.js");
const guild_1 = require("../database/guild");
const view = (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
        if (!(interaction.member.roles instanceof discord_js_1.GuildMemberRoleManager)) {
            throw new Error('roles can not be processed');
        }
        if (!interaction.member.roles.cache.find(r => r.id === guildData.roleID)) {
            yield interaction.reply({
                content: 'You dont have access to view the users'
            });
            return;
        }
        const guild = yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.fetch());
        if (!guild) {
            throw new Error('guild not found');
        }
        const members = guild.members.cache.filter(m => {
            if (guildData.validMembers.includes(m.id))
                return true;
            return false;
        });
        yield interaction.reply({
            content: `**Valid Members**\n${members.map(m => `<@${m.id}> `)}`,
            ephemeral: true
        });
    }
    catch (error) {
        throw error;
    }
});
exports.view = view;
