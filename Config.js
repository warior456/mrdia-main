const botprefix = process.env.PREFIX;
const botowner = process.env.OWNER;
const botdctoken = process.env.DISCORD_TOKEN;
const botinvite = process.env.INVITE;
const botdbtoken = process.env.DBTOKEN;
const botyoutubecookie = process.env.YOUTUBECOOKIE
const botserverwakeapilink = process.env.SERVERWAKE_API_LINK
const botpcwakeapilink = process.env.PCWAKE_API_LINK
module.exports = {
    prefix: [botprefix],
    owner: botowner,
    token: botdctoken,
    invite: botinvite,
    dbtoken: botdbtoken,
    youtubecookie: botyoutubecookie,
    serverwakeapilink: botserverwakeapilink,
    pcwakeapilink: botpcwakeapilink,
    musicCommandColor: '#a20000',
    otherCommandColor: '#a5fc03'
};
