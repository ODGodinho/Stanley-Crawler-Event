export const googleSearchSelector = {
    searchInput: "input[name=\"q\"]",
    buttons: {
        submit: "input[name=\"btnK\"] >> visible=true",
    },
};

export type GoogleSearchSelectorType = typeof googleSearchSelector;
