import { randomUUID } from "node:crypto";

import { ODGDecorators } from "@odg/chemical-x";
import type { Logger, LoggerInterface } from "@odg/log";
import { chromium, ConnectOverCDPOptions, LaunchOptions } from "playwright";

import type { Container } from "#app/Container";
import type { BrowserManagerType } from "#engine";
import { ConfigName, ContainerName } from "#enums";
import type { ContainerInterface } from "#types";

import { $inject } from "../ContainerInject";

import { ProcessKernel } from "./ProcessKernel";

/**
 * Kernel command class
 *
 * @class Kernel
 */
@ODGDecorators.injectable(ContainerName.Kernel, "Singleton")
export class Kernel {

    public constructor(
        @$inject(ContainerName.Config) public readonly config: ContainerInterface[ContainerName.Config],
        @$inject(ContainerName.ConsoleLogger) public readonly consoleLogger: LoggerInterface,
        @$inject(ContainerName.Container) public readonly container: Container,
        @$inject(ContainerName.ProcessKernel) public readonly processKernel: ProcessKernel,
        @$inject(ContainerName.BrowserManager) public readonly browserManager: BrowserManagerType,
        @$inject(ContainerName.Logger) public readonly logger: Logger,
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
            this.container.getOptional(ContainerName.EventServiceProvider)?.shutdown(),
            this.container.getOptional(ContainerName.Browser)?.close(),
            this.container.unbindAllAsync(),
        ]);
    }

    /**
     * Init before all binders registers, just the essentials before starting all containers.
     *
     * @returns {Promise<void>}
     */
    public async init(): Promise<void> {
        this.logger.pushHandler(this.consoleLogger);
        await Promise.all([
            this.processKernel.register(),
            this.config.init(),
        ]);
    }

    private async bootLogs(): Promise<void> {
        const jsonLogger = this.container.get(ContainerName.JSONLogger);

        this.logger.pushProcessor(jsonLogger);
        jsonLogger.setIdentifier(randomUUID());
    }

    private async bootBrowser(): Promise<void> {
        const browserConnect = await this.config.get(ConfigName.BROWSER_CONNECT);
        const browserOptions: ConnectOverCDPOptions | LaunchOptions = {
            args: [
                // Use this to working in docker
                "--no-zygote",
            ],
            headless: await this.config.get(ConfigName.USE_HEADLESS),
        };

        const browser = await this.browserManager.newBrowser(async () => {
            if (browserConnect) {
                return chromium.connectOverCDP(
                    browserConnect,
                    browserOptions,
                );
            }

            return chromium.launch(browserOptions);
        });

        this.container.bind(
            ContainerName.Browser,
        ).toConstantValue(browser);
    }

}
