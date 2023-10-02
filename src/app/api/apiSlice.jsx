import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { setCredentials } from '../../tools/auth/authSlice'


const baseQuery = fetchBaseQuery({
    baseUrl: 'https://futoevoting.pythonanywhere.com/',
    credentials: 'include',
    prepareHeaders: (
        headers, 
        // { getState }
        ) => {
        const token = localStorage.getItem('token') //getState().auth.token
        headers.set("accept", "application/json");
        // if (token) {
            headers.set("Authorization",`Token${token}`)
            // console.log(`Token${token}`);
        // }
        return headers
    }
})

// const baseQueryWithReauth = async (args, api, extraOptions) => {
//     // console.log(args) // request url, method, body
//     // console.log(api) // signal, dispatch, getState()
//     // console.log(extraOptions) //custom like {shout: true}

//     let result = await baseQuery(args, api, extraOptions)

//     // If you want, handle other status codes, too
//     if (result?.error?.status === 403) {
//         console.log('sending refresh token')

//         // send refresh token to get new access token 
//         const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

//         if (refreshResult?.data) {

//             // store the new token 
//             api.dispatch(setCredentials({ ...refreshResult.data }))

//             // retry original query with new access token
//             result = await baseQuery(args, api, extraOptions)
//         } else {

//             if (refreshResult?.error?.status === 403) {
//                 refreshResult.error.data.message = "Your login has expired."
//             }
//             return refreshResult
//         }
//     }

//     return result
// }

export const apiSlice = createApi({
    baseQuery: baseQuery,
    tagTypes: ['Vote', 'User'],
    endpoints: builder => ({})
})