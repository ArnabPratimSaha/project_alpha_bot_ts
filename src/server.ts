require("dotenv").config();
import { Client, Intents,Guild,Role,GuildMember, Interaction,ApplicationCommandData } from 'discord.js';
const client:Client = new Client({ intents: [Intents.FLAGS.GUILDS ,Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS], partials: ["CHANNEL"] });
client.login(process.env.TOKEN);
import mongoose from 'mongoose';
import { Command } from './botconfig/botCommands';
import { PREFIX } from './botconfig/role';
import { add } from './commands/add';
import { commands } from './commands/commands';
import { create } from './commands/create';
import { help } from './commands/help';
import { setup } from './commands/setup';
import { GuildModel } from './database/guild';
import { MessageModel } from './database/message';
import { guildJoin } from './events/guildjoin';
import { memberUpdate } from './events/memberUpdate';
import { MessageHandler } from './functions/findData';
import { view } from './slash_commands/view';
import {add as slash_add} from './slash_commands/add';
import { remove as slash_remove } from './slash_commands/remove';
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
    client.application?.commands.create({
      name:'create',
      description:'create a message'
    })
    client.guilds.cache.forEach((g:Guild)=>{
      if(!g.available)return;
      g.commands.create({
        name:'view',
        description:'view the valid users'
      })
      g.commands.create({
        name:'add',
        description:'add a member to the valid list',
        options:[
          {name:'member',description:'member of the guild',type:'USER',required:true}
        ]
      })
      g.commands.create({
        name:'remove',
        description:'remove a member from the valid list',
        options:[
          {name:'member',description:'member of the guild',type:'USER',required:true}
        ]
      })
    })

    const handler=new MessageHandler();
    await handler.handleMessageData(client);
    MessageModel.watch().on('change', () => handler.handleMessageData(client));
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
              await create(msg.channel,msg.author);
            }
            else if (msg.content === Command.add.toString()) {
                await add(msg.channel);
            }
        }
        else if (msg.channel.type === 'GUILD_TEXT')//text channel massage
        {
          if (msg.content === `${PREFIX.toString()}setup`) {
            try {
              const role=await setup(msg.channel.guild);
              await msg.reply(`ROLE ${role} is Created And Updated.`)
            } catch (error) {
              if(error instanceof Error){
                await msg.reply(error.message);
              }
            }
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
      console.log('join');
      
        const guild:Guild=await g.fetch();
        await guildJoin(guild);
    } catch (error) {
      console.log(error);
    }
});
client.on('guildDelete', async (g) => {
    try {
      console.log('leave');
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

  client.on('interactionCreate',async(interaction:Interaction)=>{
    try {
      if(!interaction.isCommand())return;
      if (interaction.commandName==='user') {
        await interaction.reply({
          ephemeral:true,
          content:'hello'
        })
      }
      if(interaction.commandName==='view'){
        await view(interaction);
      }
      if(interaction.commandName==='add'){
        await slash_add(interaction);
      }
      if(interaction.commandName==='remove'){
        await slash_remove(interaction);
      }
    } catch (error) {
      console.log(error);
      if(interaction.isCommand()){
        await interaction.reply({
          content: `something went wrong`,
          ephemeral: true
        })
      }
    }
  })
