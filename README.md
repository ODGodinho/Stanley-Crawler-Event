<h1 align="center">
    <a href="https://github.com/ODGodinho">
        <img
            src="https://raw.githubusercontent.com/ODGodinho/Stanley-TheTemplate/main/public/images/Stanley.jpg"
            alt="Stanley Imagem" width="500"
        />
    </a>
    <br />
    Stanley Crawler With Events By Dragons Gamers
    <br />
</h1>

<h4 align="center">Template Stanley for Crawler Puppeteer/Playwright project 🤖!</h4>

<p align="center">

[![Stargazers](https://img.shields.io/github/stars/ODGodinho/Stanley-Crawler-Event?color=F430A4)](https://github.com/ODGodinho/Stanley-Crawler-Event/stargazers)
[![Made by ODGodinho](https://img.shields.io/badge/made%20by-ODGodinho-%2304A361)](https://www.linkedin.com/in/victor-alves-odgodinho/)
[![Forks](https://img.shields.io/github/forks/ODGodinho/Stanley-Crawler-Event?color=CD4D34)](https://github.com/ODGodinho/Stanley-Crawler-Event/network/members)
![Repository size](https://img.shields.io/github/repo-size/ODGodinho/Stanley-Crawler-Event)
[![GitHub last commit](https://img.shields.io/github/last-commit/ODGodinho/Stanley-Crawler-Event)](https://github.com/ODGodinho/Stanley-Crawler-Event/commits/master)
[![License](https://img.shields.io/badge/license-MIT-brightgreen)](https://opensource.org/licenses/MIT)

</p>

# Table of Contents

- [🎇 Benefits](#-benefits)
- [📗 Libraries](#-libraries)
- [📁 Dependencies](#-dependencies)
- [⏩ Get Started](#-get-started)
  - [🔘 Use Template](#-use-template)
  - [🔑 Engine Example](#-configure-github-token)
    - [🙈 Change to Puppeteer](#-change-to-puppeteer)
  - [💻 Prepare to develop](#-prepare-to-develop)
  - [📍 Start Project](#-start-project)
  - [📨 Build and Run](#-build-and-run)
  - [🧪 Teste Code](#-teste-code)

---

## 🎇 Benefits

- 🚀 Speed start new crawler using typescript
- 🚨 Over 800 rules for pattern, possible errors and errors in Linter
- 🎇 Code quality guaranteed
- 📢 AutoReview when opening a pull-request/merge
    ![AutoReview Comment example](https://user-images.githubusercontent.com/3797062/97085944-87233a80-165b-11eb-94a8-0a47d5e24905.png)
- 🧪 Automatic Test when opening pull-request/merge
- 📦 Automatic Package and release generate on merge
- ⚙️ IOT/IOC (Inversion of Control) for easy use of libraries

## 📗 Libraries

- [Node.js 16](https://nodejs.org/?n=dragonsgamers)
- [Typescript](https://www.typescriptlang.org/?n=dragonsgamers)
- [Eslint](https://eslint.org/?n=dragonsgamers)
- [ODG-Linter-JS](https://github.com/ODGodinho/ODG-Linter-Js?n=dragonsgamers)
- [EditorConfig](https://editorconfig.org/?n=dragonsgamers)
- [ReviewDog](https://github.com/reviewdog/action-eslint)

## 📁 Dependencies

- [Node.js](https://nodejs.org) 16 or later
- [Yarn](https://yarnpkg.com/) Optional/Recommended
- [ODG TsConfig](https://github.com/ODGodinho/tsconfig) Last Version

## ⏩ Get Started

---

### 🔘 Use Template

Click in use this template button and clone your template project

![Use Template](https://raw.githubusercontent.com/ODGodinho/Stanley-TheTemplate/main/public/images/UseTemplate.png)

### 🔑 Configure Github Token

#### 🙈 Change to Puppeteer

To change you crawler to use puppeteer you change `./engine.ts` file for:

```typescript
import puppeteer, {
    type Browser,
    type PuppeteerLaunchOptions,
    type Page,
    type BrowserContext,
    type PuppeteerNode,
} from "puppeteer";

export type BrowserTypeEngine = PuppeteerNode;

export type BrowserClassEngine = Browser;

export type ContextClassEngine = BrowserContext;

export type PageClassEngine = Page;

export type BrowserOptionsEngine = PuppeteerLaunchOptions;

export const browserEngine = puppeteer;
```

### 💻 Prepare To Develop

Copy `.env.example` to `.env` and add the values according to your needs.

### 📍 Start Project

First install dependencies with the following command

```bash
yarn install
# or
npm install
```

## 📨 Build and Run

To build the project, you can use the following command

> if you change files, you need to run `yarn build` and `yarn start` again

```bash
yarn build && yarn start
# or
yarn dev
```

## 🧪 Teste Code

To Test execute this command

```bash
yarn test
# or
yarn test:watch
```
