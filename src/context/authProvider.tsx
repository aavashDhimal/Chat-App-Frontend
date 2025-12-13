import React, { useMemo } from "react"
import { AuthContext } from "./auth"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { clearToken } from "@/slices/authSlice"
import { useNavigate } from "react-router"

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.auth.token) ?? localStorage.getItem("access_token")

    function parseJwt(token: string) {
        try {
            const base64Url = token.split(".")[1]
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
            return JSON.parse(atob(base64))
        } catch {
            return null
        }
    }

    const isAuthenticated = useMemo(() => {
        if (!token) return false
        const payload = parseJwt(token)
        if (!payload?.exp) return false
        return payload.exp * 1000 > new Date().getTime()
    }, [token])

    const value = useMemo(
        () => ({
            token,
            isAuthenticated,
            logout: () => {
                dispatch(clearToken())
                navigate("/login")
            },
        }),
        [token, isAuthenticated, dispatch, navigate]
    )

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
