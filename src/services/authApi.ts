import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const api = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4040",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<
      { accessToken: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      
    }),
    register: builder.mutation<
      { accessToken: string; user: { id: string; email: string; name: string } },
      { name: string; email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation } = api
