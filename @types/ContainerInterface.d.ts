import type { EventBusInterface } from "@odg/events";
import type { JSONLoggerPlugin } from "@odg/json-log";
import type { LoggerInterface } from "@odg/log";
import type { MessageInterface } from "@odg/message";

import type { Container } from "#app/Container";
import type { MyConfig } from "#configs";
import type {
    BrowserClassEngine,
    BrowserManagerType,
} from "#engine";
import type { ContainerName } from "#enums";
import type { GoogleSearchToSelectionHandler } from "#handlers";
import type { SearchEventListener } from "#listeners";
import type { SearchPage } from "#pages";
import type { EventServiceProvider } from "#providers";
import type { ExampleCrawlerService } from "#services";

import type { Kernel, ProcessKernel } from "../src/Console";

import type { EventTypes } from "./EventsInterface";

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
