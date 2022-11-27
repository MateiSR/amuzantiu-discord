import { Collection } from "discord.js";
import { client } from "../..";
import { ExtendedClient } from './Client';

export default class CooldownManager extends Collection<string, Collection<string, number>> { // CommandName, Collection<UserId, Timestamp (when cooldown started)>

    client: ExtendedClient = client;

    constructor() {
        super();
    }

    async handleCooldown(commandName: string, userId: string, cooldown: number) {
        // CommandName
        const existingCooldown = this.get(commandName);
        // If Cooldown Collection exists
        if (existingCooldown) {
            const userCooldown = existingCooldown.get(userId);
            if (userCooldown) return;
            existingCooldown.set(userId, Date.now());
            setTimeout(() => {
                existingCooldown.delete(userId);
            }, cooldown);
            return;
        }
        // Collection<UserId, Timestamp>
        const cooldownCollection = new Collection<string, any>();
        // If Cooldown Collection does not exist
        cooldownCollection.set(userId, Date.now());
        this.set(commandName, cooldownCollection);
        setTimeout(() => {
            cooldownCollection.delete(userId);
        }, cooldown);
    }

    checkCooldown(commandName: string, userId: string) {
        // Returns false if user is not on cooldown
        // Returns timestamp of cooldown start if user is on cooldown
        const existingCooldown = this.get(commandName);
        if (!existingCooldown) return false;
        if (existingCooldown.has(userId)) return existingCooldown.get(userId);
        return false;
    }

    removeCooldown(commandName: string, userId: string) {
        const existingCooldown = this.get(commandName);
        if (!existingCooldown) return;
        existingCooldown.delete(userId);
    }

    clearCooldown(userId: string) {
        this.forEach((value, key) => {
            if (value.has(userId)) value.delete(userId);
        });
    }

    clearCooldowns() {
        this.clear();
    }

}