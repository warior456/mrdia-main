const { chalk } = import("chalk");

module.exports = {
    name: 'connected',
    async execute() {
        console.log(chalk.green("[Database Status]: Connected"))
    }
}