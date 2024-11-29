import { randomUUID } from "node:crypto";

import { LoggerInterface } from "@odg/log";
import { inject, injectable } from "inversify";
import { chromium } from "playwright-core";

import { ContainerInterface } from "#types";
import Container from "@app/Container";
import { type MyBrowser, BrowserManagerType } from "@engine";
import { ConfigName, ContainerName } from "@enums";
import { ProcessKernel } from "~/Console/ProcessKernel";

/**
 * Kernel command class
 *
 * @class Kernel
 */
@injectable()
export class Kernel {

    public constructor(
        @inject(ContainerName.Config) public readonly config: ContainerInterface[ContainerName.Config],
        @inject(ContainerName.ConsoleLogger) public readonly consoleLogger: LoggerInterface,
        @inject(ContainerName.Container) public readonly container: Container,
        @inject(ContainerName.ProcessKernel) public readonly processKernel: ProcessKernel,
        @inject(ContainerName.BrowserManager) public readonly browserManager: BrowserManagerType,
    ) {
    }

    /**
     * Boot all containers, and prepare robot to execution
     *
     * @returns {Promise<void>}
     */
    public async boot(): Promise<void> {
        await Promise.all([
            this.container.get(ContainerName.Logger)!.info("Kernel Starting"),
            this.bootLogs(),
            this.bootBrowser(),
            this.container.get(ContainerName.EventServiceProvider).boot(),
            process.send?.("ready"),
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
        const logger = this.container.get(ContainerName.Logger)!;
        const jsonLogger = this.container.get(ContainerName.JSONLogger);
        logger.pushHandler(this.consoleLogger);
        logger.pushProcessor(jsonLogger);
        jsonLogger.setIdentifier(randomUUID());
    }

    private async bootBrowser(): Promise<void> {
        const browser = await this.browserManager.newBrowser(async () => chromium.launch({
            args: [
                "--no-zygote", // Use this to working in docker
            ],
            headless: await this.config.get(ConfigName.USE_HEADLESS),
        })) as MyBrowser;

        this.container.bind(
            ContainerName.Browser,
        ).toConstantValue(browser);
    }

}
