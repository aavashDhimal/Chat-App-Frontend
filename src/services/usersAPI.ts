import { apis } from './api';

export const usersApi = apis.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => '/chat/users',
        }),
        getChatBoxUSers: builder.query({
            query: (id: string) => `/users/${id}`
        })
    })
});

export const {
    useGetUsersQuery,
    useGetChatBoxUSersQuery
} = usersApi;