export const googleSearchSelector = {
    searchInput: "input[name=\"q\"], textarea[type='search']",
    buttons: {
        submit: "input[name=\"btnK\"] >> visible=true",
    },
};

export type GoogleSearchSelectorType = typeof googleSearchSelector;
