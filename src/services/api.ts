import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apis = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getMessages: builder.query<
      Array<{ id: string; sender: string; text: string; timestamp: string; status?: string }>,
      string
    >({
      query: (roomId: string) => `/chat/rooms/${roomId}/messages`,
      // keepUnusedDataFor: 60, // optional
    }),
  })
})

export const { useGetMessagesQuery } = apis