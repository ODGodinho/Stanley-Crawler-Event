import {
    chromium,
    type BrowserType,
    type Browser,
    type LaunchOptions,
    type Page,
    type BrowserContext,
    type BrowserContextOptions,
} from "playwright-core";

import { type Context as ContextClass, type Browser as BrowserClass } from "./Browser";

export type BrowserTypeEngine = BrowserType;

export type BrowserClassEngine = Browser;

export type ContextClassEngine = BrowserContext;

export type PageClassEngine = Page;

export type BrowserOptionsEngine = LaunchOptions;

export type ContextOptionsEngine = BrowserContextOptions;

// My Page Union Engine

export type MyBrowser = BrowserClass & BrowserClassEngine;

export type MyPage = Page & PageClassEngine;

export type MyContext = ContextClass & ContextClassEngine;

export const browserEngine = chromium;
