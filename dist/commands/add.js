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
const add = (channel) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const embededMessage = new discord_js_1.MessageEmbed();
        embededMessage.setTitle('VIVI');
        embededMessage.setURL(`${process.env.FRONTENDAPI}home`);
        embededMessage.setColor('BLUE');
        embededMessage.setImage('https://lh3.googleusercontent.com/pw/AM-JKLVp-A0OhVBY8tExBYtSWDhmTFQAuHyrcOKFwe6sfG_fD6b4J3dfK_egegS9Se-NdbQKPLztF5jqgG6yjTNrDhN07RbDY-cdFIzBq0Begd7rgQlXHHKd3S6eLfzghfgQBppNQjm-GDqJvUHVBrDT2CY=w1484-h748-no?authuser=0');
        const footer = {
            text: `Created By VIVI`,
        };
        embededMessage.setFooter(footer);
        embededMessage.setTimestamp(new Date());
        embededMessage.addField('Link', `Add [VIVI](${process.env.BOTLINK}) Now.\t Or goto [:link:](${process.env.FRONTENDAPI}home) for more information about the bot. `);
        embededMessage.addField('VIVI', `**VIVI is a bot that takes care your problems of managing messages,with VIVI in your server you can stop worrying about fogetting to send something to your server and friends.VIVI can send message in both discord channel and also in their personal DM**`);
        const response = yield channel.send({ content: `Generated A link \n${process.env.FRONTENDAPI}home`, embeds: [embededMessage] });
    }
    catch (error) {
        console.log(error);
    }
});
exports.add = add;
