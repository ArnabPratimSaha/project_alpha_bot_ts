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
const setup_1 = require("./commands/setup");
const guild_1 = require("./database/guild");
const message_1 = require("./database/message");
const guildjoin_1 = require("./events/guildjoin");
const memberUpdate_1 = require("./events/memberUpdate");
const findData_1 = require("./functions/findData");
const view_1 = require("./slash_commands/view");
const add_2 = require("./slash_commands/add");
const remove_1 = require("./slash_commands/remove");
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
    var _a, _b, _c;
    try {
        console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}!`);
        (_b = client.user) === null || _b === void 0 ? void 0 : _b.setActivity('DM me commands', { type: 'LISTENING' });
        (_c = client.application) === null || _c === void 0 ? void 0 : _c.commands.create({
            name: 'create',
            description: 'create a message'
        });
        client.guilds.cache.forEach((g) => {
            if (!g.available)
                return;
            g.commands.create({
                name: 'view',
                description: 'view the valid users'
            });
            g.commands.create({
                name: 'add',
                description: 'add a member to the valid list',
                options: [
                    { name: 'member', description: 'member of the guild', type: 'USER', required: true }
                ]
            });
            g.commands.create({
                name: 'remove',
                description: 'remove a member from the valid list',
                options: [
                    { name: 'member', description: 'member of the guild', type: 'USER', required: true }
                ]
            });
        });
        const handler = new findData_1.MessageHandler();
        yield handler.handleMessageData(client);
        message_1.MessageModel.watch().on('change', () => handler.handleMessageData(client));
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
                try {
                    const role = yield (0, setup_1.setup)(msg.channel.guild);
                    yield msg.reply(`ROLE ${role} is Created And Updated.`);
                }
                catch (error) {
                    if (error instanceof Error) {
                        yield msg.reply(error.message);
                    }
                }
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
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!interaction.isCommand())
            return;
        if (interaction.commandName === 'user') {
            yield interaction.reply({
                ephemeral: true,
                content: 'hello'
            });
        }
        if (interaction.commandName === 'view') {
            yield (0, view_1.view)(interaction);
        }
        if (interaction.commandName === 'add') {
            yield (0, add_2.add)(interaction);
        }
        if (interaction.commandName === 'remove') {
            yield (0, remove_1.remove)(interaction);
        }
    }
    catch (error) {
        console.log(error);
        if (interaction.isCommand()) {
            yield interaction.reply({
                content: `something went wrong`,
                ephemeral: true
            });
        }
    }
}));
