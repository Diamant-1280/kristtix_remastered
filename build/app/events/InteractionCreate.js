"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("@app/index");
const Event_1 = require("@classes/Event");
exports.default = new Event_1.Event('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        await interaction.deferReply();
        const command = index_1.client.commands.get(interaction.commandName);
        if (!command)
            return interaction.followUp("Извините, данная интеграция более не доступна.\nОбратитесь за поддержкой [сюда](https://discord.gg/kuNSEksg)");
        command.run({
            args: interaction.options,
            client: index_1.client,
            interaction: interaction
        });
    }
});
//# sourceMappingURL=InteractionCreate.js.map