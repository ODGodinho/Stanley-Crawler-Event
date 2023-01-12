export const googleHomeSelectors = {
    searchInput: "input[name=\"q\"]",
    buttons: {
        submit: "input[name=\"btnK\"] >> visible=true",
    },
};

export type GoogleHomeSelectorsType = typeof googleHomeSelectors;
