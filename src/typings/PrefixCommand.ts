import {
    Message,
    PermissionResolvable
} from "discord.js";
import { ExtendedClient } from "../structures/Client";

interface RunOptions {
    client: ExtendedClient;
    message: Message;
    args: string[];
}

type RunFunction = (options: RunOptions) => any;

export type PrefixCommandType = {
    name: string;
    description: string;
    defaultMemberPermissions?: PermissionResolvable[];
    aliases?: string[];
    type?: "PREFIX";
    run: RunFunction;
}
