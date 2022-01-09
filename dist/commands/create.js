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
exports.create = void 0;
const discord_js_1 = require("discord.js");
const uuid_1 = require("uuid");
const link_1 = require("../database/link");
const create = (channel, author) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield link_1.LinkModel.findOneAndDelete({ discordId: author.id });
        const entryId = (0, uuid_1.v4)();
        const link = new link_1.LinkModel({
            discordId: author.id,
            entryId: entryId,
            entryTime: new Date()
        });
        yield link.save();
        const embededMessage = new discord_js_1.MessageEmbed();
        embededMessage.setTitle('Link Generated');
        embededMessage.setURL(`${process.env.FRONTENDAPI}val/${author.id}/${entryId}/dashboard`);
        embededMessage.setColor('BLUE');
        embededMessage.setImage('https://lh3.googleusercontent.com/pw/AM-JKLVp-A0OhVBY8tExBYtSWDhmTFQAuHyrcOKFwe6sfG_fD6b4J3dfK_egegS9Se-NdbQKPLztF5jqgG6yjTNrDhN07RbDY-cdFIzBq0Begd7rgQlXHHKd3S6eLfzghfgQBppNQjm-GDqJvUHVBrDT2CY=w1484-h748-no?authuser=0');
        const footer = {
            text: `Created By VIVI`,
        };
        embededMessage.setFooter(footer);
        embededMessage.setTimestamp(new Date());
        embededMessage.addField('Link', `A link has been generated for you\nGo to [VIVI](${process.env.FRONTENDAPI}val/${author.id}/${entryId}/dashboard) to create your massage\nLink will expire in ${10} min`);
        embededMessage.addField('Warning', `**DO NOT SHARE THIS LINK WITH OTHERS**`);
        const response = yield channel.send({ content: `Generated A link \n${process.env.FRONTENDAPI}val/${author.id}/${entryId}/dashboard`, embeds: [embededMessage] });
        return response;
    }
    catch (error) {
        console.log(error);
        return null;
    }
});
exports.create = create;
