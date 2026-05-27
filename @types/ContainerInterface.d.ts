import type { EventBusInterface } from "@odg/events";
import type { JSONLoggerPlugin } from "@odg/json-log";
import type { LoggerInterface } from "@odg/log";
import type { MessageInterface } from "@odg/message";

import type { Container } from "../src/app/Container.ts";
import type { ContainerName } from "../src/app/Enums/index.ts";
import type { SearchEventListener } from "../src/app/Listeners/index.ts";
import type { EventServiceProvider } from "../src/app/Provider/index.ts";
import type { ExampleCrawlerService } from "../src/app/Services/index.ts";
import type { MyConfig } from "../src/Configs/index.ts";
import type { Kernel, ProcessKernel } from "../src/Console/index.ts";
import type {
    BrowserClassEngine,
    BrowserManagerType,
} from "../src/engine.ts";
import type { GoogleSearchToSelectionHandler } from "../src/Handlers/index.ts";
import type { SearchPage } from "../src/Pages/index.ts";

import type { EventTypes } from "./EventsInterface.d.ts";

export interface ContainerInterface {
    [ContainerName.Logger]: LoggerInterface;
    [ContainerName.Browser]: BrowserClassEngine | undefined;
    [ContainerName.Requester]: MessageInterface;
    [ContainerName.EventBus]: EventBusInterface<EventTypes>;
    [ContainerName.ProcessKernel]: ProcessKernel;
    [ContainerName.Kernel]: Kernel;
    [ContainerName.BrowserManager]: BrowserManagerType;
    [ContainerName.Container]: Container;
    [ContainerName.Config]: MyConfig;
    [ContainerName.ConsoleLogger]: LoggerInterface;
    [ContainerName.JSONLogger]: JSONLoggerPlugin;
    [ContainerName.EventServiceProvider]: EventServiceProvider<EventTypes>;

    // Application

    // Pages
    [ContainerName.SearchPage]: SearchPage;

    // Handlers
    [ContainerName.GoogleSearchToSelectionHandler]: GoogleSearchToSelectionHandler;

    // Events Listeners
    [ContainerName.SearchEventListener]: SearchEventListener;

    // Services
    [ContainerName.ExampleCrawlerService]: ExampleCrawlerService;
}

export type ContainerType<T extends Record<ContainerName, unknown> = ContainerInterface> = T;

export type ContainerNameType = keyof ContainerInterface;
