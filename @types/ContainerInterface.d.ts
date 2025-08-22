import { type ConfigInterface } from "@odg/config";
import { type EventListenerInterface, type EventBusInterface } from "@odg/events";
import { type JSONLoggerPlugin } from "@odg/json-log";
import { type Logger, type LoggerInterface } from "@odg/log";
import { type MessageInterface } from "@odg/message";

import type Container from "@app/Container";
import { type ConfigType } from "@configs";
import {
    type BrowserClassEngine,
    type BrowserManagerType,
} from "@engine";
import { type EventName, type ContainerName } from "@enums";
import { type PageOrHandlerFactoryType } from "@factory";
import { type SearchPage } from "@pages/Google/SearchPage";
import { type EventServiceProvider } from "@providers/EventServiceProvider";
import { type ExampleCrawlerService } from "@services/ExampleCrawlerService";
import { type Kernel, type ProcessKernel } from "~/Console";

import { type EventTypes } from "./EventsInterface";

export interface ContainerInterface {
    [ContainerName.Logger]: Logger | undefined;
    [ContainerName.Browser]: BrowserClassEngine | undefined;
    [ContainerName.Requester]: MessageInterface;
    [ContainerName.EventBus]: EventBusInterface<EventTypes>;
    [ContainerName.ProcessKernel]: ProcessKernel;
    [ContainerName.Kernel]: Kernel;
    [ContainerName.BrowserManager]: BrowserManagerType;
    [ContainerName.Container]: Container;
    [ContainerName.Config]: ConfigInterface<ConfigType>;
    [ContainerName.ConsoleLogger]: LoggerInterface;
    [ContainerName.JSONLogger]: JSONLoggerPlugin;
    [ContainerName.EventServiceProvider]: EventServiceProvider<EventTypes>;

    // Application

    // Pages
    [ContainerName.SearchPageFactory]: PageOrHandlerFactoryType<SearchPage>;

    // Handler
    [ContainerName.SearchHandlerFactory]: PageOrHandlerFactoryType<SearchPage>;

    // Events
    [ContainerName.SearchEventListener]: EventListenerInterface<EventTypes, EventName.SearchPageEvent>;

    // Services
    [ContainerName.ExampleCrawlerService]: ExampleCrawlerService;
}

export type ContainerType<T extends Record<ContainerName, unknown> = ContainerInterface> = T;

export type ContainerNameType = keyof ContainerType;
