const { chalk } = import("chalk");

module.exports = {
    name: 'disconnected',
    async execute() {
        console.log(chalk.red("[Database Status]: Disconnected"))
    }
}