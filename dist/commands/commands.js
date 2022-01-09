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
exports.commands = void 0;
const discord_js_1 = require("discord.js");
const botCommands_1 = require("../botconfig/botCommands");
const commands = (channel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const embededMessage = new discord_js_1.MessageEmbed();
        embededMessage.setTitle('COMMANDS');
        embededMessage.addField(`Setup The Bot`, `\`${botCommands_1.Command.setup}\` to ${botCommands_1.commandInfo.get(botCommands_1.Command.setup) || ''}`);
        embededMessage.addField(`View your log`, `\`${botCommands_1.Command.log}\` to ${botCommands_1.commandInfo.get(botCommands_1.Command.log) || ''}`);
        embededMessage.addField(`Request Help`, `\`${botCommands_1.Command.help}\` to ${botCommands_1.commandInfo.get(botCommands_1.Command.help) || ''}`);
        embededMessage.addField(`Commands`, `\`${botCommands_1.Command.commands}\` to ${botCommands_1.commandInfo.get(botCommands_1.Command.commands) || ''}`);
        embededMessage.addField(`Create a link to start writing messages`, `\`${botCommands_1.Command.create}\` to ${botCommands_1.commandInfo.get(botCommands_1.Command.create) || ''}`);
        embededMessage.addField(`A link to bot to your server`, `\`${botCommands_1.Command.add}\` to ${botCommands_1.commandInfo.get(botCommands_1.Command.add) || ''}`);
        const footer = {
            text: `Created By VIVI`,
        };
        embededMessage.setFooter(footer);
        embededMessage.setTimestamp(new Date());
        embededMessage.setColor('GREEN');
        const response = yield channel.send({ content: 'List of commands', embeds: [embededMessage] });
        return response;
    }
    catch (error) {
        return null;
    }
});
exports.commands = commands;
