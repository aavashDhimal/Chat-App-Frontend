import { Route,Routes } from "react-router-dom"
import LoginPage from "./pages/login/page"
function App() {
  return (
  <Routes>

    <Route path="/login" element={<LoginPage/>} />
  </Routes>
  )
}

export default App