const botprefix = process.env.PREFIX;
const botowner = process.env.OWNER;
const botdctoken = process.env.DISCORD_TOKEN;
const botinvite = process.env.INVITE;
const botdbtoken = process.env.DBTOKEN;
const botyoutubecookie = process.env.YOUTUBECOOKIE
module.exports = {
    prefix: [botprefix],
    owner: botowner,
    token: botdctoken,
    invite: botinvite,
    dbtoken: botdbtoken,
    youtubecookie: botyoutubecookie,
    musicCommandColor: '#a20000'
};
