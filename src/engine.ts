import {
    chromium,
    type BrowserType,
    type Browser,
    type LaunchOptions,
    type Page,
    type BrowserContext,
    type BrowserContextOptions,
} from "playwright-core";

export type BrowserTypeEngine = BrowserType;

export type BrowserOptionsEngine = LaunchOptions;

export type ContextOptionsEngine = BrowserContextOptions;

// My Engine

export type BrowserClassEngine = Browser;

export type ContextClassEngine = BrowserContext;

export type PageClassEngine = Page;

export const browserEngine = chromium;
