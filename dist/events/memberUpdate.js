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
exports.memberUpdate = void 0;
const guild_1 = require("../database/guild");
const memberUpdate = (oldMember, newMember) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const guild = newMember.guild;
        const guildData = yield guild_1.GuildModel.findOne({ guildID: guild.id });
        const oldRole = oldMember.roles.cache.find(role => role.id === (guildData === null || guildData === void 0 ? void 0 : guildData.roleID));
        const newRole = newMember.roles.cache.find(role => role.id === (guildData === null || guildData === void 0 ? void 0 : guildData.roleID));
        if (!oldRole && newRole) //assigned the vivi role
         {
            guildData === null || guildData === void 0 ? void 0 : guildData.validMembers.push(newMember.id);
            yield (guildData === null || guildData === void 0 ? void 0 : guildData.save());
        }
        if (oldRole && !newRole) //removed the VIVI role
         {
            if (guildData === null || guildData === void 0 ? void 0 : guildData.validMembers) {
                guildData.validMembers = guildData === null || guildData === void 0 ? void 0 : guildData.validMembers.filter(m => m !== newMember.id);
            }
            yield (guildData === null || guildData === void 0 ? void 0 : guildData.save());
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.memberUpdate = memberUpdate;
