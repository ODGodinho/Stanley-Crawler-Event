import { randomUUID } from "node:crypto";

import { provide } from "@inversifyjs/binding-decorators";
import { Logger, LoggerInterface } from "@odg/log";
import { injectable } from "inversify";
import { chromium } from "playwright";

import { ContainerInterface } from "#types";
import type { Container } from "@app/Container";
import { BrowserManagerType } from "@engine";
import { ConfigName, ContainerName } from "@enums";
import { ProcessKernel } from "~/Console/ProcessKernel";
import { $inject } from "~/ContainerInject";

/**
 * Kernel command class
 *
 * @class Kernel
 */
@injectable("Singleton")
@provide(ContainerName.Kernel)
export class Kernel {

    public constructor(
        @$inject(ContainerName.Config) public readonly config: ContainerInterface[ContainerName.Config],
        @$inject(ContainerName.ConsoleLogger) public readonly consoleLogger: LoggerInterface,
        @$inject(ContainerName.Container) public readonly container: Container,
        @$inject(ContainerName.ProcessKernel) public readonly processKernel: ProcessKernel,
        @$inject(ContainerName.BrowserManager) public readonly browserManager: BrowserManagerType,
    ) {
    }

    /**
     * Boot all containers, and prepare robot to execution
     *
     * @returns {Promise<void>}
     */
    public async boot(): Promise<void> {
        await Promise.all([
            this.container.get(ContainerName.Logger).info("Kernel Starting"),
            this.bootLogs(),
            this.bootBrowser(),
            this.container.get(ContainerName.EventServiceProvider).boot(),
        ]);
        process.send?.("ready");
    }

    /**
     * Shutdown all containers, and end All background Process
     *
     * @returns {Promise<void>}
     */
    public async shutdown(): Promise<void> {
        await Promise.all([
            this.container.get(ContainerName.EventServiceProvider).shutdown(),
            this.container.getOptional(ContainerName.Browser)?.close(),
            this.container.unbindAll(),
        ]);
    }

    /**
     * Init before all binders registers, just the essentials before starting all containers.
     *
     * @returns {Promise<void>}
     */
    public async init(): Promise<void> {
        await Promise.all([
            this.processKernel.register(),
            this.config.init(),
        ]);
    }

    private async bootLogs(): Promise<void> {
        const logger = this.container.get(ContainerName.Logger);
        const jsonLogger = this.container.get(ContainerName.JSONLogger);

        (logger as Logger).pushHandler(this.consoleLogger);
        (logger as Logger).pushProcessor(jsonLogger);

        jsonLogger.setIdentifier(randomUUID());
    }

    private async bootBrowser(): Promise<void> {
        const browser = await this.browserManager.newBrowser(async () => chromium.launch({
            args: [
                // Use this to working in docker
                "--no-zygote",
            ],
            headless: await this.config.get(ConfigName.USE_HEADLESS),
        }));

        this.container.bind(
            ContainerName.Browser,
        ).toConstantValue(browser);
    }

}
