//state-management library
//auth store keeps authentication information in one shared place
//Saves the store in browser storage so it can survive page refreshes.

//Zustand is the tool; Auth Store is what you build with that tool to manage authentication.

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore=create(
    persist(
        (set)=>({
             user: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,

      login:(response)=>set({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          isLoggedIn: true,

      }),
      logout:()=>set({
        user: null,
          accessToken: null,
          refreshToken: null,
          isLoggedIn: false,

      }),


        }),
        {
            name:"auth-storage",
        }

    )
);