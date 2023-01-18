const {SlashCommandBuilder, PermissionsBitField} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('users')
        .setDefaultMemberPermissions(PermissionsBitField.All)
        .setDescription('Gets all the users'),
    async execute(interaction, users) {
        console.log(users);

        if (!users || users.length === 0) return interaction.reply({
            content: "No users found.",
            ephemeral: true
        });

        let usersText = "";

        for (const user of users.values()) {
            usersText += `${user.id} - ${user.name}\n`;
        }

        await interaction.reply({
            content: "```\n" + usersText + "\n```",
            ephemeral: true
        });
    },
};