import type { BrowserManager } from "@odg/chemical-x";
import {
    chromium,
    type Browser,
    type BrowserContext,
    type BrowserContextOptions,
    type BrowserType,
    type LaunchOptions,
    type Page,
} from "playwright";

export type BrowserTypeEngine = BrowserType;

export type BrowserOptionsEngine = LaunchOptions;

export type ContextOptionsEngine = BrowserContextOptions;

// My Engine

export type BrowserClassEngine = Browser;

export type ContextClassEngine = BrowserContext;

export type PageClassEngine = Page;

export type BrowserManagerType = BrowserManager<BrowserClassEngine, ContextClassEngine, PageClassEngine>;

export const browserEngine = chromium;
