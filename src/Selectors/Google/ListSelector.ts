export const googleListSelector = {
    notResult: "#rso > div > div > div > div > span > svg",
    results: {
        resultTitles: "#search .g h3",
    },
};

export type GoogleListSelectorType = typeof googleListSelector;
