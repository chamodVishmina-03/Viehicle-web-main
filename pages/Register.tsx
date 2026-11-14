import { notify } from "../lib/toast"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "../service/auth"
import { AuthLayout } from "../components/layout/AuthLayout"
import { Button } from "../components/common/Button"
import { InputField } from "../components/forms/InputField"
import { errMsg } from "../lib/constants"

function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [conPassword, setConPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!name || !email || !password || !conPassword)
      return notify("Please fill all required fields")
    if (password !== conPassword) return notify("Passwords do not match")
    setLoading(true)
    try {
      await register(name, email, phone, password)
      notify("Registration success")
      navigate("/login")
    } catch (err) {
      notify(errMsg(err, "Registration failed"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create account" subtitle="Join AutoCare as a customer.">
      <InputField label="Full name" placeholder="John Perera" value={name} onChange={(e) => setName(e.target.value)} />
      <InputField label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <InputField label="Phone (optional)" placeholder="07X XXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <InputField label="Confirm" type="password" value={conPassword} onChange={(e) => setConPassword(e.target.value)} />
      </div>
      <Button onClick={handleRegister} isLoading={loading} className="w-full mt-2" size="lg">Create account</Button>
      <p className="text-sm text-slate-600 text-center mt-2">
        Already registered?{" "}
        <button onClick={() => navigate("/login")} className="text-brand-600 font-bold hover:underline cursor-pointer">Sign in</button>
      </p>
    </AuthLayout>
  )
}

export default Register
