import { useLocation } from "react-router-dom";
import { useAuth } from "./auth";
import { Navigate,Outlet } from "react-router-dom";


export function ProtectedRoute() {
const { isAuthenticated } = useAuth()
const location = useLocation()




if (!isAuthenticated) {
    console.log(isAuthenticated,"nonos")
return <Navigate to="/login" replace state={{ from: location }} />
}


return <Outlet />
}