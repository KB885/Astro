const { client } = require('./DiscordBot')

async function addChatCollector (guildID, channelID) {
    // `m` is a message object that will be passed through the filter function
    const guild = await client.guilds.cache.get(guildID)
    const channel = await guild.channels.cache.get(channelID)

    const filter = m => !(m.system || m.webhookId) // no system messages or webhook messages
    try {
        return channel.createMessageCollector({ filter, dispose: true, time: 150000 })
    } catch(e) {return null}
}
async function readLatestMessages (guildID, channelID) {
    try {
        const guild = await client.guilds.cache.get(guildID)
        const channel = await guild.channels.cache.get(channelID)
        const messages = await channel.messages.fetch({ limit: 100 })
        return messages.reverse()
    } catch (e) { return null }
}

module.exports = { readLatestMessages, addChatCollector }
