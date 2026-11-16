import React, { useState } from "react"
import { notify } from "../lib/toast"
import { useAuth } from "../hooks/useAuth"
import { updateMyProfile } from "../service/auth"
import { PageHeader } from "../components/common/PageHeader"
import { InputField } from "../components/forms/InputField"
import { Button } from "../components/common/Button"
import { errMsg } from "../lib/constants"

export const Profile: React.FC = () => {
  const { user, setUser } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [email, setEmail] = useState(user?.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [saving, setSaving] = useState(false)

  const emailChanged = email.trim().toLowerCase() !== (user?.email || "")
  const needsPassword = emailChanged || !!newPassword

  const save = async () => {
    if (!name.trim()) return notify("Name cannot be empty", "error")
    if (needsPassword && !currentPassword)
      return notify("Enter your current password to change email or password", "error")
    setSaving(true)
    try {
      const res = await updateMyProfile({
        name,
        phone,
        email,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined
      })
      setUser(res.data)
      setCurrentPassword("")
      setNewPassword("")
      notify("Profile saved", "success")
    } catch (err) {
      notify(errMsg(err, "Failed to update profile"), "error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <PageHeader title="My Profile" description="Update your contact details, email and password." />

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <InputField label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <InputField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <div>
          <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {user?.roles?.includes("ADMIN") && (
            <p className="text-[11px] text-slate-400 mt-1.5">
              Customers reply to this address when you email them an invoice or receipt.
            </p>
          )}
        </div>
        <InputField
          label="New password (optional)"
          type="password"
          placeholder="Leave blank to keep current"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        {needsPassword && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
            <p className="text-xs text-amber-900 font-medium">
              For security, confirm your current password to change your {emailChanged ? "email" : "password"}.
            </p>
            <InputField
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
        )}

        <Button onClick={save} isLoading={saving} className="w-full">
          Save changes
        </Button>
      </div>
    </div>
  )
}
