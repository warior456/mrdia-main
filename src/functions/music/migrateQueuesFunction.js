const fs = require("fs").promises;
const path = require("path");
const Queue = require("../../schemas/queue");
const mongoose = require("mongoose");
const File = require("../File");

/**
 * Migrate a single legacy CSV queue to MongoDB
 * @param {string} guildId - Guild ID where queue is stored
 * @param {string} csvFileName - CSV file name (without .csv extension)
 * @param {string} userId - User ID of queue owner
 * @param {string} userName - Username of queue owner
 * @returns {Promise<object>} Migration result
 */
async function migrateSingleQueue(guildId, csvFileName, userId, userName) {
	try {
		const csvPath = path.join(process.cwd(), "guildData", guildId, `${csvFileName}.csv`);

		// Read CSV file
		const csvContent = await File.read(csvPath);
		if (!csvContent) {
			return { success: false, error: "CSV file is empty" };
		}

		// Parse CSV (format: url;requestedBy\n)
		const lines = csvContent.trim().split("\n");
		const songs = [];

		for (const line of lines) {
			const [url, requestedById, ...rest] = line.split(";");
			if (url) {
				songs.push({
					url: url.trim(),
					name: "Migrated Song", // Original name not stored in CSV
					requestedBy: requestedById?.trim() || userId,
					requestedByName: rest.join(";").trim() || userName,
				});
			}
		}

		if (songs.length === 0) {
			return { success: false, error: "No valid songs found in CSV" };
		}

		// Check if queue already exists in DB
		let dbQueue = await Queue.findOne({
			serverId: guildId,
			queueName: csvFileName,
			queueOwnerId: userId,
		});

		if (dbQueue) {
			// Update existing queue
			dbQueue.songs = songs;
			dbQueue.updatedAt = new Date();
			await dbQueue.save();
			return {
				success: true,
				message: `Updated existing queue: ${csvFileName}`,
				songsCount: songs.length,
			};
		} else {
			// Create new queue
			dbQueue = await new Queue({
				_id: new mongoose.Types.ObjectId(),
				queueName: csvFileName,
				serverId: guildId,
				queueOwnerId: userId,
				queueOwnerName: userName,
				songs: songs,
			});
			await dbQueue.save();
			return {
				success: true,
				message: `Migrated new queue: ${csvFileName}`,
				songsCount: songs.length,
			};
		}
	} catch (error) {
		console.error(`Error migrating queue ${csvFileName}:`, error);
		return {
			success: false,
			error: error.message,
		};
	}
}

/**
 * Migrate all legacy CSV queues for a guild to MongoDB
 * @param {string} guildId - Guild ID to migrate
 * @param {object} options - Migration options
 * @returns {Promise<array>} Array of migration results
 */
async function migrateAllGuildQueues(guildId, options = {}) {
	const { userId = null, userName = "Unknown" } = options;

	try {
		const guildDir = path.join(process.cwd(), "guildData", guildId);

		// Read all CSV files
		let csvFiles = [];
		try {
			const files = await fs.readdir(guildDir);
			csvFiles = files.filter((f) => f.endsWith(".csv"));
		} catch (err) {
			if (err.code === "ENOENT") {
				return [{ success: false, error: "Guild directory not found" }];
			}
			throw err;
		}

		if (csvFiles.length === 0) {
			return [{ success: false, error: "No CSV queues found to migrate" }];
		}

		const results = [];

		for (const csvFile of csvFiles) {
			const queueName = csvFile.replace(".csv", "");
			const result = await migrateSingleQueue(guildId, queueName, userId, userName);
			results.push({
				file: csvFile,
				...result,
			});
		}

		return results;
	} catch (error) {
		console.error(`Error migrating guild ${guildId}:`, error);
		return [{ success: false, error: error.message }];
	}
}

module.exports = {
	migrateSingleQueue,
	migrateAllGuildQueues,
};
