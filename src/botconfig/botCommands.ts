import { PREFIX, ROLE } from "./role"
enum Command{
    log="log",
    setup="setup",
    help="help",
    commands="commands",
    create="create",
    add="add"
}
const commandInfo=new Map<Command,String>([
    [Command.add,`get a link to add this bot in your server`],
    [Command.create,`gives to link to create the massage **(only if you the role ${ROLE.ROLE_NAME})**`],
    [Command.commands,`shows every command`],
    [Command.help,`shows you the commands and also gives you a brief description on how it works`],
    [Command.setup,`add a bot to your server and ready your server to have the feature **(only if you the role ${ROLE.ROLE_NAME})** **(only available in the server chat [prefix  ${PREFIX}])**`],
    [Command.log,`logs out your massage by time **(only if you the role ${ROLE.ROLE_NAME})**`],
])

export {Command,commandInfo};