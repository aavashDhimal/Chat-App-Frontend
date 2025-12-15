import { apis } from './api';

export const croomApi = apis.injectEndpoints({
    endpoints: (builder) => ({
        getRooms: builder.query({
            query: () => '/chat/rooms',
        }),

        createRoom: builder.mutation({
            query: (roomData: { members: string[] }) => ({
                url: "/chat/rooms",
                method: "POST",
                body: roomData,
            }),
        }),
    })
});

export const {
    useGetRoomsQuery,
    useCreateRoomMutation
} = croomApi;