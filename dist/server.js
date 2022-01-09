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
const botCommands_1 = require("./botconfig/botCommands");
const role_1 = require("./botconfig/role");
const add_1 = require("./commands/add");
const commands_1 = require("./commands/commands");
const create_1 = require("./commands/create");
const help_1 = require("./commands/help");
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
// ====================Event triggered when a message has been sent=====================
client.on('messageCreate', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.author.bot)
        return;
    try {
        if (msg.channel.type === 'DM') {
            if (msg.content === botCommands_1.Command.commands.toString()) {
                yield (0, commands_1.commands)(msg.channel);
            }
            else if (msg.content === botCommands_1.Command.help.toString()) {
                yield (0, help_1.help)(msg.channel);
            }
            else if (msg.content === botCommands_1.Command.log.toString()) {
                // await command_log(msg.channel, msg.author, client);
            }
            else if (msg.content === botCommands_1.Command.create.toString()) {
                yield (0, create_1.create)(msg.channel, msg.author);
            }
            else if (msg.content === botCommands_1.Command.add.toString()) {
                yield (0, add_1.add)(msg.channel);
            }
        }
        else if (msg.channel.type === 'GUILD_TEXT') //text channel massage
         {
            if (msg.content === `${role_1.PREFIX.toString()}setup`) {
                // const { status, role, error } = await command_setup(msg.guild, msg.member);
                // if (error) return msg.reply(`something went wrong.`);
                // if (!status && !role) return msg.reply(`Only members with **Administrator** role have the permission to ceate or update role.`);
                // if (!status && role) return msg.reply(`ROLE ${role} is already created.Delete the role inorder to create another.`);
                // msg.reply(`ROLE ${role} is Created And Updated.`)
            }
        }
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
