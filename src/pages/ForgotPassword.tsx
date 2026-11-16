import { useState } from "react"
import { Link } from "react-router-dom"
import { forgotPassword } from "../service/auth"
import { Button } from "../components/common/Button"
import { InputField } from "../components/forms/InputField"
import { AuthLayout } from "../components/layout/AuthLayout"
import { errMsg } from "../lib/constants"
import { notify } from "../lib/toast"

const toInternal = (link: string) => {
  try {
    const u = new URL(link, window.location.origin)
    return u.pathname + u.search
  } catch {
    return "/forgot-password"
  }
}

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [devLink, setDevLink] = useState("")

  const submit = async () => {
    if (!email.trim()) return notify("Please enter your email")
    setLoading(true)
    try {
      const res = await forgotPassword(email.trim())
      setDevLink(res.devResetLink || "")
      setSent(true)
    } catch (err) {
      notify(errMsg(err, "Could not send reset link"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email and we’ll send you a link to reset it."
    >
      {sent ? (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm rounded-xl p-4">
            If an account exists for <b>{email}</b>, a reset link has been sent. It is valid for 30 minutes.
          </div>
          {devLink && (
            <div className="bg-amber-50 border border-amber-100 text-amber-900 text-xs rounded-xl p-4 break-all">
              <p className="font-bold mb-1">Dev mode (no email server configured)</p>
              <Link to={toInternal(devLink)} className="underline">{devLink}</Link>
            </div>
          )}
        </div>
      ) : (
        <>
          <InputField
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          <Button onClick={submit} isLoading={loading} className="w-full mt-2" size="lg">
            Send reset link
          </Button>
        </>
      )}
      <p className="text-sm text-slate-600 text-center mt-2">
        <Link to="/login" className="text-brand-600 font-bold hover:underline">← Back to sign in</Link>
      </p>
    </AuthLayout>
  )
}

export default ForgotPassword
