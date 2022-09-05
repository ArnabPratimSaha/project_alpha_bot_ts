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
exports.sendMessage = void 0;
const discord_js_1 = require("discord.js");
const schema_1 = require("../interface and enum/schema");
const changeStatus_1 = require("./changeStatus");
const getChannelsFromId = (guild, query) => {
    const validChannels = [];
    guild.channels.cache.forEach((channel) => {
        if (channel.type === 'GUILD_TEXT' && query.includes(channel.id)) {
            validChannels.push(channel);
        }
    });
    return validChannels;
};
const getRolessFromId = (guild, query) => {
    const validRoles = [];
    guild.roles.cache.forEach((role) => {
        if (query.includes(role.id)) {
            validRoles.push(role);
        }
    });
    return validRoles;
};
const getGuildMembersFromId = (guild, query) => {
    const validMembers = [];
    guild.members.cache.forEach((member) => {
        if (query.includes(member.id)) {
            validMembers.push(member);
        }
    });
    return validMembers;
};
const getMessage = (title, message, sender) => {
    return `Message created By ${sender}\n${title ? `**${title}**\n` : ''}${message}\n`;
};
const sendMessage = (client, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const guild = yield client.guilds.fetch(message.targetGuild.toString());
        const embeded = new discord_js_1.MessageEmbed();
        embeded.setColor('BLURPLE');
        const user = yield client.users.fetch(message.sender.toString());
        embeded.setTitle(`Message Created By **${user.username}** Using VIVI`);
        embeded.setFooter({ text: `Created By VIVI` });
        embeded.setTimestamp(new Date());
        const guildMembers = getGuildMembersFromId(guild, message.members || []);
        if (message.type === schema_1.MessageType.CHANNEL) {
            const validChannels = getChannelsFromId(guild, message.channels || []);
            validChannels.forEach((c) => __awaiter(void 0, void 0, void 0, function* () {
                if (!(c instanceof discord_js_1.BaseGuildTextChannel))
                    return;
                const roles = getRolessFromId(guild, message.roles || []);
                try {
                    yield c.send({
                        content: `${guildMembers.map(m => `<@${m.id}> `)} ${roles.map(r => (r.id !== guild.roles.everyone.id) ? `<@&${r.id}> ` : `${r.name} `)}\n${getMessage(message.title, message.message, user)}`,
                        embeds: [embeded]
                    });
                }
                catch (e) {
                    console.log('could not send a message to channel'); //work
                    yield (0, changeStatus_1.changeMessageStatus)(message, schema_1.MessageStatus.CANCELLED);
                }
            }));
            yield (0, changeStatus_1.changeMessageStatus)(message, schema_1.MessageStatus.SENT);
        }
        if (message.type === schema_1.MessageType.DM) {
            guildMembers.forEach((member) => __awaiter(void 0, void 0, void 0, function* () {
                yield member.send({
                    content: `${getMessage(message.title, message.message, user)}`,
                    embeds: [embeded]
                });
            }));
            yield (0, changeStatus_1.changeMessageStatus)(message, schema_1.MessageStatus.SENT);
        }
    }
    catch (error) {
    }
});
exports.sendMessage = sendMessage;
