

module.exports = (message, client) =>{
    
    client.user.setActivity(`starting`, { type: 'PLAYING' });
    console.log(`Logged to the client ${client.user.username}\n-> Ready on ${client.guilds.cache.size} servers for a total of ${client.users.cache.size} users`);
    console.log('Mrdia is Online');

    const activities = [`${process.env.PREFIX}help`, `${process.env.PREFIX}help`];


    const updateDelay = 20; // in seconds
    let currentIndex = 0;

    setInterval(() => {
        const activity = activities[currentIndex];
        client.user.setActivity(activity);

        // update currentIndex
        // if it's the last one, get back to 0
    currentIndex = currentIndex >= activities.length - 1 
            ? 0
            : currentIndex + 1;
  }, updateDelay * 1000);

    // console.log(client.guilds.cache.id[0])
    // client.guild[0].createInvite({ unique: false, temporary: false }).then(invite => {
    //     console.log(message.guild.id)
    //     console.log(invite.code);
    // })
}
