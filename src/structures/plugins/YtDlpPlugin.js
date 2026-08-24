const { PlayableExtractorPlugin, Song, Playlist, DisTubeError } = require("distube");
const { spawn, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const https = require("https");

const isWindows = process.platform === "win32";
const defaultFilename = `yt-dlp${isWindows ? ".exe" : ""}`;

function findBinary() {
	if (process.env.YTDLP_PATH && fs.existsSync(process.env.YTDLP_PATH)) {
		return process.env.YTDLP_PATH;
	}

	const candidates = [
		path.join(process.cwd(), "node_modules", "@distube", "yt-dlp", "bin", defaultFilename),
		path.join(process.cwd(), "bin", defaultFilename),
		path.join(__dirname, "..", "..", "..", "bin", defaultFilename),
		path.join(__dirname, "..", "..", "..", "node_modules", "@distube", "yt-dlp", "bin", defaultFilename)
	];

	for (const candidate of candidates) {
		if (fs.existsSync(candidate)) {
			return candidate;
		}
	}

	// Try system PATH
	try {
		const cmd = isWindows ? `where ${defaultFilename}` : `which yt-dlp`;
		const res = execSync(cmd, { stdio: ["pipe", "pipe", "ignore"], encoding: "utf8" }).trim();
		const firstLine = res.split(/\r?\n/)[0];
		if (firstLine && fs.existsSync(firstLine)) {
			return firstLine;
		}
	} catch {
		// Not in PATH
	}

	return candidates[0];
}

async function downloadBinary(targetPath) {
	const dir = path.dirname(targetPath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	const downloadUrl = `https://github.com/yt-dlp/yt-dlp/releases/latest/download/${defaultFilename}`;
	console.log(`[YtDlpPlugin] Downloading latest yt-dlp binary from ${downloadUrl}...`);

	return new Promise((resolve, reject) => {
		const fetchWithRedirects = (url, redirects = 0) => {
			if (redirects > 5) return reject(new Error("Too many redirects"));

			https.get(url, { headers: { "User-Agent": "mrdia-bot" } }, (res) => {
				if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
					return fetchWithRedirects(res.headers.location, redirects + 1);
				}
				if (res.statusCode !== 200) {
					return reject(new Error(`Failed to download yt-dlp: HTTP ${res.statusCode}`));
				}

				const fileStream = fs.createWriteStream(targetPath, { mode: 0o755 });
				res.pipe(fileStream);
				fileStream.on("finish", () => {
					fileStream.close(() => {
						try {
							fs.chmodSync(targetPath, 0o755);
						} catch {}
						console.log(`[YtDlpPlugin] Downloaded yt-dlp to ${targetPath}`);
						resolve(targetPath);
					});
				});
				fileStream.on("error", reject);
			}).on("error", reject);
		};

		fetchWithRedirects(downloadUrl);
	});
}

function runYtDlp(binaryPath, args, options = {}) {
	return new Promise((resolve, reject) => {
		const proc = spawn(binaryPath, args, options);
		let stdout = "";
		let stderr = "";

		proc.stdout?.on("data", (chunk) => {
			stdout += chunk.toString("utf8");
		});

		proc.stderr?.on("data", (chunk) => {
			stderr += chunk.toString("utf8");
		});

		proc.on("error", (err) => {
			reject(new Error(`Failed to execute yt-dlp: ${err.message}`));
		});

		proc.on("close", (code) => {
			if (code !== 0) {
				const errorMsg = stderr.trim() || stdout.trim() || `yt-dlp exited with code ${code}`;
				return reject(new Error(errorMsg));
			}

			// Clean stdout to extract valid JSON
			const trimmed = stdout.trim();
			// Find first '{' or '[' to ignore any leading stdout warnings/notices
			const jsonStartObj = trimmed.indexOf("{");
			const jsonStartArr = trimmed.indexOf("[");
			let startIdx = 0;
			if (jsonStartObj !== -1 && jsonStartArr !== -1) {
				startIdx = Math.min(jsonStartObj, jsonStartArr);
			} else if (jsonStartObj !== -1) {
				startIdx = jsonStartObj;
			} else if (jsonStartArr !== -1) {
				startIdx = jsonStartArr;
			}

			const jsonStr = trimmed.slice(startIdx);
			try {
				const parsed = JSON.parse(jsonStr);
				resolve(parsed);
			} catch (parseErr) {
				reject(new Error(`Failed to parse yt-dlp JSON output: ${parseErr.message}\nOutput preview: ${jsonStr.slice(0, 200)}`));
			}
		});
	});
}

class YtDlpSong extends Song {
	constructor(plugin, info, options = {}) {
		super(
			{
				plugin,
				source: info.extractor || "youtube",
				playFromSource: true,
				id: info.id,
				name: info.title || info.fulltitle || "Unknown Title",
				url: info.webpage_url || info.original_url || info.url,
				isLive: Boolean(info.is_live),
				thumbnail: info.thumbnail || (info.thumbnails && info.thumbnails[0] ? info.thumbnails[0].url : undefined),
				duration: info.is_live ? 0 : (info.duration || 0),
				uploader: {
					name: info.uploader || info.channel || info.artist || "Unknown Artist",
					url: info.uploader_url || info.channel_url
				},
				views: info.view_count || 0,
				likes: info.like_count || 0,
				dislikes: info.dislike_count || 0,
				reposts: info.repost_count || 0,
				ageRestricted: Boolean(info.age_limit && info.age_limit >= 18)
			},
			options
		);
	}
}

class CustomYtDlpPlugin extends PlayableExtractorPlugin {
	constructor(options = {}) {
		super();
		this.options = options;
		this.binaryPath = options.binaryPath || findBinary();

		if (!fs.existsSync(this.binaryPath)) {
			downloadBinary(this.binaryPath).catch((err) => {
				console.error("[YtDlpPlugin] Binary auto-download failed:", err);
			});
		}
	}

	init(distube) {
		super.init(distube);
		if (this.distube.plugins[this.distube.plugins.length - 1] !== this) {
			console.warn(`[${this.constructor.name}] This plugin is recommended to be the last plugin in DisTube.`);
		}
	}

	validate() {
		return true;
	}

	async resolve(input, options = {}) {
		let query = typeof input === "string" ? input.trim() : "";
		const isUrl = /^https?:\/\//i.test(query);
		if (!isUrl) {
			query = `ytsearch1:${query}`;
		}

		const flags = [
			query,
			"--dump-single-json",
			"--no-warnings",
			"--prefer-free-formats",
			"--skip-download",
			"--simulate",
			"--flat-playlist"
		];

		if (this.options.cookies) {
			flags.push("--cookies", this.options.cookies);
		}

		let info;
		try {
			info = await runYtDlp(this.binaryPath, flags);
		} catch (err) {
			throw new DisTubeError("YTDLP_ERROR", err.message);
		}

		if (info._type === "playlist" || Array.isArray(info.entries)) {
			let entries = info.entries || [];
			if (entries.length === 0) {
				throw new DisTubeError("YTDLP_ERROR", "The playlist is empty or no search results were found.");
			}

			// If it was a search (ytsearch1), return single song directly
			if (query.startsWith("ytsearch1:") && entries.length > 0) {
				return new YtDlpSong(this, entries[0], options);
			}

			return new Playlist(
				{
					source: info.extractor || "youtube",
					songs: entries.map((entry) => new YtDlpSong(this, entry, options)),
					id: info.id ? info.id.toString() : "",
					name: info.title || "Playlist",
					url: info.webpage_url || (isUrl ? query : undefined),
					thumbnail: info.thumbnails?.[0]?.url || info.thumbnail
				},
				options
			);
		}

		return new YtDlpSong(this, info, options);
	}

	async getStreamURL(song) {
		if (!song.url) {
			throw new DisTubeError("YTDLP_INVALID_SONG", "Cannot get stream URL from invalid song.");
		}

		const flags = [
			song.url,
			"--dump-single-json",
			"--no-warnings",
			"--prefer-free-formats",
			"--skip-download",
			"--simulate",
			"-f",
			"ba/ba*"
		];

		if (this.options.cookies) {
			flags.push("--cookies", this.options.cookies);
		}

		let info;
		try {
			info = await runYtDlp(this.binaryPath, flags);
		} catch (err) {
			throw new DisTubeError("YTDLP_ERROR", err.message);
		}

		if (Array.isArray(info.entries)) {
			if (!info.entries[0]?.url) {
				throw new DisTubeError("YTDLP_ERROR", "Cannot get stream URL for playlist entry.");
			}
			return info.entries[0].url;
		}

		if (!info.url) {
			throw new DisTubeError("YTDLP_ERROR", "No stream URL found in yt-dlp output.");
		}

		return info.url;
	}

	getRelatedSongs() {
		return [];
	}
}

module.exports = {
	CustomYtDlpPlugin,
	YtDlpPlugin: CustomYtDlpPlugin,
	YtDlpSong,
	runYtDlp
};
