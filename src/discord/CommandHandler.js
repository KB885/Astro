async function HandleCommand (interaction) {
    const { commandName } = interaction
    switch (commandName) {
    case 'ping':
        await interaction.reply('Pong!')
        break
    default:
        break
    }
}

module.exports.Handlecommand = HandleCommand
