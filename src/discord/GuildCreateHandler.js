const User = require('../app/Models/User');
const Project = require('../app/Models/Project');
const { MessageActionRow, MessageButton } = require('discord.js');
//https://discord.js.org/#/docs/main/stable/class/ClientUser?scrollTo=send
async function OnGuildCreate (guild) {
    /*guild.fetchAuditLogs().then(audit => {
        audit.entries.first().executor.send('Hello thanks for adding me')
    })*/
    const auditLogs = await guild.fetchAuditLogs();
    const user = await auditLogs.entries.first().executor;
    const projects = await User.findOne({'discord': user.id}, 'projectIDs');
    let message = `Hello thanks for adding me to ${guild.name} (id:${guild.id})\nClick to link to project:\n`

    if (projects.count() > 25)
        console.log("Too many projects"); //TODO: handling of more than 25 projects for a user
    let rowArray = [];
    let currentRow = new MessageActionRow();
    for (let i = 0; i < projects.count(); i++) { //TODO: make so that proper name for project etc. is displayed
        currentRow.addComponents(new MessageButton().setCustomId(`${projects[i]}`).setLabel('primary').setStyle('PRIMARY'),)
        if (i % 5 === 4)
        {
            rowArray.push(currentRow);
            currentRow = new MessageActionRow();
        }
    }
    if (projects.count() % 5 !== 4)
        rowArray.push(currentRow)


    const sentMessage = await user.send({content: message/*, components: rowArray*/});
    const collector = sentMessage.createMessageComponentCollector({
        componentType: 'BUTTON',
        maxComponents: 1
    });
    collector.on('collect', async messageInteraction => {
        const projectID = messageInteraction.customId;
        const project = await Project.findOne({'_id': projectID});
        project.categories.messaging.services.push("Discord Server: " + guild.id);
        CreateWebHook(guild);
        CreateInvite(guild);
        await messageInteraction.update({ content: `You have linked guild ${guild.id} to: ${projectID}`, components: [] });
    });
}
function CreateWebHook (guild) {
    const channel = guild.channels.cache().fetch().first();
    channel.createWebhook('ProjectHub Webhook', {
        //Insert options like profilepic etc. here
    }).then(webhook => {
        console.log(`Created webhook ${webhook}`)
        project.categories.messaging.services.push("Discord WebHook: " + webhook.id);
        //guild.fetchWebhooks().get(webhook.id);

    })
        .catch(console.error);
}
function CreateInvite (guild) {
    guild.invites.create(guild.channels.cache().fetch().first(), {maxAge: 0, reason: "Invite project members from ProjectHub"})
        .then(invite => {
            project.categories.messaging.services.push("Discord InviteCode: " + invite.code);
        })
}

module.exports = { OnGuildCreate };
