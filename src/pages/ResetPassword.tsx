import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { resetPassword } from "../service/auth"
import { Button } from "../components/common/Button"
import { InputField } from "../components/forms/InputField"
import { AuthLayout } from "../components/layout/AuthLayout"
import { errMsg } from "../lib/constants"
import { notify } from "../lib/toast"

function ResetPassword() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get("token") || ""
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (password.length < 6) return notify("Password must be at least 6 characters")
    if (password !== confirm) return notify("Passwords do not match")
    setLoading(true)
    try {
      await resetPassword(token, password)
      notify("Password updated. Please sign in.", "success")
      navigate("/login")
    } catch (err) {
      notify(errMsg(err, "Reset failed"))
    } finally {
      setLoading(false)
    }
  }

  if (!token)
    return (
      <AuthLayout title="Invalid link" subtitle="This password reset link is missing its token.">
        <Link to="/forgot-password" className="text-brand-600 font-bold hover:underline text-sm">
          Request a new link
        </Link>
      </AuthLayout>
    )

  return (
    <AuthLayout title="Set new password" subtitle="Choose a new password for your account.">
      <InputField label="New password" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
      <InputField label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
      <Button onClick={submit} isLoading={loading} className="w-full mt-2" size="lg">
        Update password
      </Button>
    </AuthLayout>
  )
}

export default ResetPassword
