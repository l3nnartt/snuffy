const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { api } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Get information of the selected user, or your own info.')
		.addUserOption(option => option.setName('target').setDescription('The user\'s info to show')),
	async execute(interaction, client) {
		const user = interaction.options.getUser('target') || interaction.user;
		const member = interaction.guild.members.cache.get(user.id)
		fetch(api + user.id, {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        })
        .then((res) => res.json())
        .then((data) => {
			const embed = new MessageEmbed()
				.setAuthor(`User info for ${user.username}`, user.displayAvatarURL())
				.addFields(
					{
						name: `${user.tag}`,
						value: `ID: \`${data.id}\``,
					},
					{
						name: 'First server join',
						value: `${data.firstjoin}`,
					},
					{
						name: 'Latest server join',
						value: `${new Date(member.joinedTimestamp).toLocaleDateString()} ${new Date(member.joinedTimestamp).toLocaleTimeString()}`,
					},
					{
						name: 'Account created',
						value: `${new Date(user.createdTimestamp).toLocaleDateString()} ${new Date(user.createdTimestamp).toLocaleTimeString()}`,
					}
				)
				.setTimestamp(interaction.createdAt)
				.setFooter(`${client.user.username}`, client.user.displayAvatarURL())
			if (user) return interaction.reply({embeds: [embed]});
			return interaction.reply({embeds: [embed]});
		})
	},
};