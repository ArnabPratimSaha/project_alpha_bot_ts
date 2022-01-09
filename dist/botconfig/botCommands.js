"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandInfo = exports.Command = void 0;
const role_1 = require("./role");
var Command;
(function (Command) {
    Command["log"] = "log";
    Command["setup"] = "setup";
    Command["help"] = "help";
    Command["commands"] = "commands";
    Command["create"] = "create";
    Command["add"] = "add";
})(Command || (Command = {}));
exports.Command = Command;
const commandInfo = new Map([
    [Command.add, `get a link to add this bot in your server`],
    [Command.create, `gives to link to create the massage **(only if you the role ${role_1.ROLE.ROLE_NAME})**`],
    [Command.commands, `shows every command`],
    [Command.help, `shows you the commands and also gives you a brief description on how it works`],
    [Command.setup, `add a bot to your server and ready your server to have the feature **(only if you the role ${role_1.ROLE.ROLE_NAME})** **(only available in the server chat [prefix  ${role_1.PREFIX}])**`],
    [Command.log, `logs out your massage by time **(only if you the role ${role_1.ROLE.ROLE_NAME})**`],
]);
exports.commandInfo = commandInfo;
