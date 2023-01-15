export const googleSearchSelectors = {
    searchInput: "input[name=\"q\"]",
    buttons: {
        submit: "input[name=\"btnK\"] >> visible=true",
    },
};

export type GoogleSearchSelectorsType = typeof googleSearchSelectors;
