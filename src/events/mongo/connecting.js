const { chalk } = import("chalk");

module.exports = {
    name: 'connecting',
    async execute() {
        console.log(chalk.cyan("[Database Status]: Connecting..."))
    }
}