import chalk from 'chalk';

export default class Logger {

    public log(...message: any[]) {
        console.log(chalk.green(`[LOG] ${message.join(' ')}`));
    }

    public info(...message: any[]) {
        console.log(chalk.blue(`[INFO] ${message.join(' ')}`));
    }

    public warn(...message: any[]) {
        console.log(chalk.yellow(`[WARN] ${message.join(' ')}`));
    }

    public error(...message: any[]) {
        console.log(chalk.red(`[ERROR] ${message.join(' ')}`));
    }

    public debug(...message: any[]) {
        console.log(chalk.magenta(`[DEBUG] ${message.join(' ')}`));
    }

}