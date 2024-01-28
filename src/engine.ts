import { type BrowserManager } from "@odg/chemical-x";
import {
    chromium,
    type BrowserType,
    type Browser,
    type LaunchOptions,
    type Page,
    type BrowserContext,
    type BrowserContextOptions,
} from "playwright-core";

import { type Browser as BrowserClass, type Context as ContextClass } from "./Browser";

export type BrowserTypeEngine = BrowserType;

export type BrowserOptionsEngine = LaunchOptions;

export type ContextOptionsEngine = BrowserContextOptions;

// My Engine

export type BrowserClassEngine = Browser;

export type ContextClassEngine = BrowserContext;

export type PageClassEngine = Page;

export const browserEngine = chromium;

export type MyBrowser = BrowserClass & BrowserClassEngine;

export type MyPage = Page & PageClassEngine;

export type MyContext = ContextClass & ContextClassEngine;

export type BrowserManagerType = BrowserManager<BrowserClassEngine, ContextClassEngine, PageClassEngine>;
