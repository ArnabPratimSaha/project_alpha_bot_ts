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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const discord_js_1 = require("discord.js");
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.Intents.FLAGS.DIRECT_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_PRESENCES, discord_js_1.Intents.FLAGS.GUILD_MEMBERS], partials: ["CHANNEL"] });
client.login(process.env.TOKEN);
const mongoose_1 = __importDefault(require("mongoose"));
const guild_1 = require("./database/guild");
const guildjoin_1 = require("./events/guildjoin");
const memberUpdate_1 = require("./events/memberUpdate");
const connectMongo = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield mongoose_1.default.connect(process.env.DATABASE || '');
        console.log(`Successfully Connected to ${response.connection.db.databaseName}`);
    }
    catch (error) {
        console.log('could not connect to mongoDB ATLAS');
    }
});
connectMongo();
// ====================Event triggered when the bot is ready to start working=====================
client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}!`);
        (_b = client.user) === null || _b === void 0 ? void 0 : _b.setActivity('DM me commands', { type: 'LISTENING' });
    }
    catch (error) {
        console.log(error);
    }
}));
client.on('guildMemberUpdate', (oldMember, newMember) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, memberUpdate_1.memberUpdate)(oldMember, newMember);
    }
    catch (error) {
        console.log(error);
    }
}));
client.on('guildCreate', (g) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const guild = yield g.fetch();
        yield (0, guildjoin_1.guildJoin)(guild);
    }
    catch (error) {
    }
}));
client.on('guildDelete', (g) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const guildData = yield guild_1.GuildModel.findOne({ guildID: g.id });
        if (guildData) {
            guildData.status = false;
            yield guildData.save();
        }
    }
    catch (error) {
        console.log(error);
    }
}));
client.on('roleDelete', (role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const guild = role.guild;
        const guildData = yield guild_1.GuildModel.findOne({ guildId: guild.id });
        if (role.id !== (guildData === null || guildData === void 0 ? void 0 : guildData.roleID))
            return;
        guildData.validMembers = [];
        yield guildData.save();
    }
    catch (error) {
        console.log(error);
    }
}));
