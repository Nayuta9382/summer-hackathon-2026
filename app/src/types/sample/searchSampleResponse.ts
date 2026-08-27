export type Sample = {
    id: string;
    name: string;
    category: string;
};

export type SearchSampleResponse = {
    items: Sample[];
    count: number;
};
