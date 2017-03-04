const { stripIndents } = require('common-tags');
const moment = require('moment');
const modlogs = require('../dataProviders/postgreSQL/models/Modlogs');
let settings;

module.exports = class Moderation {
	constructor(mod, member, reason, type) {
		this.mod = mod;
		this.member = member;
		this.reason = reason;
		this.type = type;
		this.user = member.user;
		this.guildID = member.guild.id;
		this.globalCaseCount = 0;
		this.currentCaseCount = 0;
	}

	getUser(type) {
		if (type === 'user') return `${this.user.username}#${this.user.discriminator} (${this.user.id})`;
		else if (type === 'avatar') return this.user.avatarURL;
		return null;
	}

	getMod() {
		if (this.mod) return `${this.mod.username}#${this.mod.discriminator} (${this.mod.id})`;
		else return `Use reason \`${this.globalCaseCount}\` <new reason>`;
	}

	async getChannel() {
		settings = await this.getAllCases();
		if (!settings.channelID) return undefined;
		return settings.channelID;
	}

	async getCaseMessageID(casePosition) {
		let newCases = await this.getCase(this.type);
		casePosition ? null : casePosition = newCases.length; // eslint-disable-line no-unused-expressions
		return newCases[casePosition].messageID;
	}

	async getAllCases() {
		settings = await modlogs.findOne({ where: { guildID: this.guildID } });
		if (!settings) settings = await modlogs.create({ guildID: this.guildID });
		this.globalCaseCount = settings.caseCount;
		return settings;
	}

	async getCase() {
		settings = await this.getAllCases();
		let currentCase = JSON.parse(settings[this.type]);
		this.currentCaseCount = currentCase.length;
		return currentCase;
	}

	saveCase(newCase) {
		settings[this.type] = JSON.stringify(newCase);
		settings.caseCount = this.globalCaseCount;
		return settings.save();
	}

	async addCase() {
		let newCases = await this.getCase(this.type);
		this.incrementCase();
		newCases.push({ userID: this.member.id, type: this.type, count: this.currentCaseCount });
		if (this.mod) newCases[newCases.length].mod = this.mod.id;
		if (this.reason) newCases[newCases.length].reason = this.reason;
		this.saveCase(newCases);
		return;
	}

	async addCaseMessageID(caseMessageID, casePosition) {
		let newCases = await this.getCase(this.type);
		casePosition ? null : casePosition = newCases.length; // eslint-disable-line no-unused-expressions
		newCases[casePosition].messageID = caseMessageID;
		this.saveCase(newCases);
	}

	async updateCase(mod, reason, casePosition) {
		let newCases = await this.getCase(this.type);
		casePosition ? null : casePosition = newCases.length; // eslint-disable-line no-unused-expressions
		newCases[casePosition].mod = mod.id;
		newCases[casePosition].reason = reason;
		this.saveCase(newCases);
	}

	incrementCase() {
		this.currentCaseCount += 1;
		this.globalCaseCount += 1;
		return;
	}

	formatDescription() {
		return stripIndents`
			**User**: ${this.getUser()}
			**Action**: ${this.type}
			**Reason**: ${this.reason ? this.reason : `Use reason \`${this.globalCaseCount}\` <new reason>`}`;
	}

	getColor() {
		switch (this.type) {
			case 'warning':
				return '#ff865e';
			case 'mute':
				return '#ffb95e';
			case 'kick':
				return '#fcaa3f';
			case 'softban':
				return '#ff5e59';
			case 'ban':
				return '#f7514c';
			default:
				return '#ff9793';
		}
	}

	formatFooter() {
		return `Case ${this.globalCaseCount} | ${moment(new Date()).format('ddd MMM DD, YYYY @ hh:mma')}`;
	}

	async viewWarnings() {
		const output = await this.mapCases();
		return output;
		// return `This user has ${settings[warnings].length} warnings, ${settings[mutes].length} mutes, ${settings[kick].length} kicks, ${settings[softbans].length} softbans, ${settings[bans].length} bans`;
	}

	async mapCases() {
		settings = await this.getAllCases();
		let res;
		for (let type of settings) {
			res += await Promise.all(type.map(thing => `${thing.count} ${thing.type}s`));
		}
		return res.join(', ');
	}


	async handleCase() {
		settings = await modlogs.findOne({ where: { guildID: this.guildID } });
		if (!settings) settings = await modlogs.create({ guildID: this.guildID });
		let caseType = JSON.parse(settings[this.type]);
		let count = caseType.length + 1;
		caseType.push({ userID: this.member.id, type: this.type, message: this.reason, count: count });
		settings[this.type] = JSON.stringify(caseType);
		await settings.save().catch(console.error);
	}
};
