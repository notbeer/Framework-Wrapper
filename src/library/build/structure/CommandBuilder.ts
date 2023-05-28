import { BeforeChatEvent } from "@minecraft/server";
import { configuration } from "../configurations.js";
import { storedRegisterInformation, registerInformation } from "../../@types/build/structure/CommandBuilder";

export class CommandBuilder {
    public prefix: string = configuration.prefix;
    private _registrationInformation: Array<storedRegisterInformation> = [];
    /**
     * Register a command with a callback
     * @param {registerInformation} register An object of information needed to register the custom command
     * @param {(data: BeforeChatEvent, args: Array<string>) => void} callback Code you want to execute when the command is executed
     * @example import { Server } from "../../Minecraft";
     *  Server.commands.register({ name: 'ping' }, (data, args) => {
     *  Server.broadcast('Pong!', data.sender.nameTag);
     * });
     */
    public register(register: registerInformation, callback: (data: BeforeChatEvent, args: Array<string>) => void): void {
        this._registrationInformation.push({
            private: register.private ? true : false,
            cancelMessage: register.cancelMessage ? true : false,
            name: register.name.toLowerCase(),
            aliases: register.aliases ? register.aliases.map(v => v.toLowerCase()) : null,
            description: register.description,
            usage: register.usage,
            example: register.example ? register.example : null,
            callback
        });
    };
    /**
     * Get a list of registered commands
     * @returns {Array<string>}
     * @example get();
     */
    public get(): Array<string> {
        const commands: Array<string> = [];
        this._registrationInformation.forEach(element => {
            if(element.private) return;
            commands.push(element.name);
        });
        return commands;
    };
    /**
     * Get all the registered informations
     * @returns {Array<storedRegisterInformation>}
     * @example getAllRegistration();
     */
    public getAllRegistation(): Array<storedRegisterInformation> {
        return this._registrationInformation;
    };
    /**
     * Get registration information on a specific command
     * @param name The command name or alias you want to get information on
     * @returns {storedRegisterInformation}
     * @example getRegistration('ping');
     */
    public getRegistration(name: string): storedRegisterInformation {
        const command = this._registrationInformation.some(element => element.name.toLowerCase() === name || element.aliases && element.aliases.includes(name));
        if(!command) return;
        let register;
        this._registrationInformation.forEach(element => {
            if(element.private) return;
            const eachCommand = element.name.toLowerCase() === name || element.aliases && element.aliases.includes(name);
            if(!eachCommand) return;
            register = element;
        });
        return register;
    };
};
export const CommandBuild = new CommandBuilder();