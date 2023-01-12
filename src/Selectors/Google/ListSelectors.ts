export const googleListSelectors = {
    notResult: "#rso > div > div > div > div > span > svg",
    results: {
        resultTitles: "#search .g h3",
    },
};

export type GoogleListSelectorsType = typeof googleListSelectors;
