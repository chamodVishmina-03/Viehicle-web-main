import AuthProvider from "./context/AuthContext"
import Router from "./router"
import { ToastHost } from "./components/common/ToastHost"

function App() {
  return (
    <AuthProvider>
      <ToastHost />
      <Router />
    </AuthProvider>
  )
}

export default App
