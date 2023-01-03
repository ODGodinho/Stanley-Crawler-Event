import {
    type BrowserType,
    chromium,
    type Browser,
    type LaunchOptions,
    type Page,
    type BrowserContext,
} from "playwright-core";

import { type Context, type Browser as BrowserClass } from "./Browser";

export type BrowserTypeEngine = BrowserType;

export type BrowserClassEngine = Browser;

export type ContextClassEngine = BrowserContext;

export type PageClassEngine = Page;

export type BrowserOptionsEngine = LaunchOptions;

// My Page Union Engine

export type MyBrowser = BrowserClass & BrowserClassEngine;

export type MyPage = Page & PageClassEngine;

export type MyContext = Context & ContextClassEngine;

export const browserEngine = chromium;
