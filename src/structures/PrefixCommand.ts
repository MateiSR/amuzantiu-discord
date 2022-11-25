import { PrefixCommandType } from "../typings/PrefixCommand";

export class PrefixCommand {
    constructor(commandOptions: PrefixCommandType) {
        Object.assign(this, commandOptions);
    }
}
