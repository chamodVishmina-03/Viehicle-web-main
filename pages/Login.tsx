import { notify } from "../lib/toast"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../service/auth"
import { AuthLayout } from "../components/layout/AuthLayout"
import { Button } from "../components/common/Button"
import { InputField } from "../components/forms/InputField"
import { errMsg } from "../lib/constants"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return notify("Please fill all fields")
    setLoading(true)
    try {
      const res = await login(email, password)
      const { access_token, refresh_token } = res.data
      if (!access_token || !refresh_token) throw new Error("Tokens missing")
      localStorage.setItem("ACCESS_TOKEN", access_token)
      localStorage.setItem("REFRESH_TOKEN", refresh_token)
      window.location.href = "/"
    } catch (err) {
      notify(errMsg(err, "Login failed"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage your vehicles and services.">
      <InputField label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <InputField label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
      <div className="text-right -mt-2">
        <button onClick={() => navigate("/forgot-password")} className="text-xs font-semibold text-brand-600 hover:underline cursor-pointer">
          Forgot password?
        </button>
      </div>
      <Button onClick={handleLogin} isLoading={loading} className="w-full mt-2" size="lg">Sign In</Button>
      <p className="text-sm text-slate-600 text-center mt-2">
        New customer?{" "}
        <button onClick={() => navigate("/register")} className="text-brand-600 font-bold hover:underline cursor-pointer">Create an account</button>
      </p>
    </AuthLayout>
  )
}

export default Login
