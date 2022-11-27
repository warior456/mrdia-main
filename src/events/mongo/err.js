const { chalk } = import("chalk");

module.exports = {
    name: 'err',
    async execute(error) {
        console.log(chalk.red(`Database error: ${error}`))
    }
}