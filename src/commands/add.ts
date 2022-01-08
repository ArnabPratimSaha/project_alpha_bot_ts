import {DMChannel,PartialDMChannel,MessageEmbed,EmbedFooterData} from 'discord.js';

const add = async (channel:DMChannel|PartialDMChannel) => {
    try {
        const embededMessage =new MessageEmbed();
        embededMessage.setTitle('VIVI')
        embededMessage.setURL(`${process.env.FRONTENDAPI}home`);
        embededMessage.setColor('BLUE')
        embededMessage.setImage('https://lh3.googleusercontent.com/pw/AM-JKLVp-A0OhVBY8tExBYtSWDhmTFQAuHyrcOKFwe6sfG_fD6b4J3dfK_egegS9Se-NdbQKPLztF5jqgG6yjTNrDhN07RbDY-cdFIzBq0Begd7rgQlXHHKd3S6eLfzghfgQBppNQjm-GDqJvUHVBrDT2CY=w1484-h748-no?authuser=0');
        const footer:EmbedFooterData={
            text:`Created By VIVI`,
        }
        embededMessage.setFooter(footer);
        embededMessage.setTimestamp(new Date());
        embededMessage.addField('Link', `Add [VIVI](${process.env.BOTLINK}) Now.\t Or goto [:link:](${process.env.FRONTENDAPI}home) for more information about the bot. `);
        embededMessage.addField('VIVI', `**VIVI is a bot that takes care your problems of managing messages,with VIVI in your server you can stop worrying about fogetting to send something to your server and friends.VIVI can send message in both discord channel and also in their personal DM**`);
        const response = await channel.send({ content: `Generated A link \n${process.env.FRONTENDAPI}home`, embeds: [embededMessage] });
    } catch (error) {
        console.log(error);
    }
}
export  { add };