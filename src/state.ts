export const collectionState: CollcectionState = {
    loading: false,
    data: []
}

export interface CollcectionState {
    loading: boolean;
    data: CollectionImage[]
}

export interface CollectionImage {
    id: string;
    created_at: Date;
    urls: {
        regular: string
    },
    user: {
        name: string;
        location: string;
        instagram_username: string;
    }
}