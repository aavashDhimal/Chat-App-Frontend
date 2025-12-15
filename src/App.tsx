import { Route, Routes,Navigate } from "react-router-dom"
import LoginPage from "./pages/auth/page"
import ChatPage from "./pages/chat/chat"
import RegisterPage from "./pages/auth/register"
import { AuthProvider } from "./context/authProvider"
import { ProtectedRoute } from "./context/ProtectedRoutes"
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<Navigate to="/chat" replace />} />

        </Route>
      </Routes>

    </AuthProvider>
  )
}

export default App

