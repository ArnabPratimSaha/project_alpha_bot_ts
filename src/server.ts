require("dotenv").config();
import { Client, Intents,Guild,Role,GuildMember } from 'discord.js';
const client:Client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS], partials: ["CHANNEL"] });
client.login(process.env.TOKEN);
import mongoose from 'mongoose';
import { Command } from './botconfig/botCommands';
import { add } from './commands/add';
import { commands } from './commands/commands';
import { help } from './commands/help';
import { GuildModel } from './database/guild';
import { guildJoin } from './events/guildjoin';
import { memberUpdate } from './events/memberUpdate';
const connectMongo = async () => {
  try {
    const response = await mongoose.connect(process.env.DATABASE||'',)
    console.log(`Successfully Connected to ${response.connection.db.databaseName}`);
  } catch (error) {
    console.log('could not connect to mongoDB ATLAS');
  }
}
connectMongo();

// ====================Event triggered when the bot is ready to start working=====================
client.on('ready', async () => {
    try {
        console.log(`Logged in as ${client.user?.tag}!`);
        client.user?.setActivity('DM me commands', { type: 'LISTENING' });
    } catch (error) {
        console.log(error);
    }
});
// ====================Event triggered when a message has been sent=====================
client.on('messageCreate', async msg => {
    if (msg.author.bot) return;
    try {
        if (msg.channel.type === 'DM') {
            if (msg.content === Command.commands.toString()) {
                await commands(msg.channel);
            }
            else if (msg.content === Command.help.toString()) {
                await help(msg.channel)
            }
            else if (msg.content === Command.log.toString()) {
                // await command_log(msg.channel, msg.author, client);
            }
            else if (msg.content === Command.create.toString()) {
                // await command_create(msg.channel, msg.author);
            }
            else if (msg.content === Command.add.toString()) {
                await add(msg.channel);
            }
        }
    } catch (error) {
      console.log(error);
    }
  });
client.on('guildMemberUpdate', async (oldMember, newMember) => {
    try {
      await memberUpdate(oldMember,newMember);
    } catch (error) {
      console.log(error);
    }
  });
client.on('guildCreate',async(g:Guild)=>{
    try {
        const guild:Guild=await g.fetch();
        await guildJoin(guild);
    } catch (error) {
        
    }
});
client.on('guildDelete', async (g) => {
    try {
      const guildData = await GuildModel.findOne({ guildID: g.id });
      if (guildData) {
        guildData.status = false;
        await guildData.save();
      }
    } catch (error) {
      console.log(error);
    }
  });
  client.on('roleDelete', async (role:Role) => {
    try {
      const guild = role.guild;
      const guildData = await GuildModel.findOne({ guildId: guild.id });
      if (role.id !== guildData?.roleID) return;
      guildData.validMembers = [];
      await guildData.save();
    } catch (error) {
      console.log(error);
    }
  })