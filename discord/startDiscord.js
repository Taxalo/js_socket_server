const {Client, Events, GatewayIntentBits, Collection} = require('discord.js');
const {token} = require('../config.json');
const {users, sockets} = require("../exports/dataExports");
const path = require("path");
const fs = require("fs");

const startDiscord = () => {
    const client = new Client({intents: [GatewayIntentBits.Guilds]});
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));

        if ('data' in command && 'execute' in command) client.commands.set(command.data.name, command);
    }

    client.once(Events.ClientReady, c => {
        console.log(`Ready! Logged in as ${c.user.tag}`);
    });

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction, users, sockets);
        } catch (error) {
            console.error(error);
            await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
        }
    });

    client.login(token).catch();
}

module.exports = startDiscord;

