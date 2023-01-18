const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emit')
        .setDefaultMemberPermissions(PermissionsBitField.All)
        .addStringOption(option =>
            option.setName('socket')
                .setRequired(true)
                .setDescription("The socket to emit to"))
        .addStringOption(option =>
            option.setName('event')
                .setRequired(true)
                .setDescription("The event to emit"))
        .setDescription('Emits a message to the socket.io client.'),
    async execute(interaction, users, sockets) {

        const option = interaction.options.getString('socket');
        const event = interaction.options.getString('event');
        const socket = sockets.find(s => s.id === option);
        if (!socket) return interaction.reply({content: `Could not find any socket with ID ${option}`, ephemeral: true});

        await socket.socket.emit("comm", event);
        await interaction.reply({
            content: 'Success',
            ephemeral: true
        });
    },
};
