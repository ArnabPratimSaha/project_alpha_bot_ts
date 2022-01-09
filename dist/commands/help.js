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
exports.help = void 0;
const discord_js_1 = require("discord.js");
const botCommands_1 = require("../botconfig/botCommands");
const help = (channel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const embededMessage = new discord_js_1.MessageEmbed();
        embededMessage.setURL(`${process.env.FRONTENDAPI}readmore`);
        embededMessage.setColor('GREEN');
        embededMessage.setTitle('HELP');
        embededMessage.addField('Website', `Go to [VIVI](${process.env.FRONTENDAPI}readmore)`);
        embededMessage.addField(botCommands_1.Command.commands.toString(), `type **${botCommands_1.Command.commands.toString()}** to see the full list of commands`);
        embededMessage.setImage('https://lh3.googleusercontent.com/pw/AM-JKLVp-A0OhVBY8tExBYtSWDhmTFQAuHyrcOKFwe6sfG_fD6b4J3dfK_egegS9Se-NdbQKPLztF5jqgG6yjTNrDhN07RbDY-cdFIzBq0Begd7rgQlXHHKd3S6eLfzghfgQBppNQjm-GDqJvUHVBrDT2CY=w1484-h748-no?authuser=0');
        const footer = {
            text: `Created By VIVI`,
        };
        embededMessage.setFooter(footer);
        embededMessage.setTimestamp(new Date());
        embededMessage.setDescription(`**Having any problem?**Go to our website to see how things works and may be you will be able to master everything that VIVI does.`);
        const response = yield channel.send({ content: 'help', embeds: [embededMessage] });
        return response;
    }
    catch (error) {
        return null;
    }
});
exports.help = help;
