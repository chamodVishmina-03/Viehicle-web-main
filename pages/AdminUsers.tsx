import { notify } from "../lib/toast"
import React, { useEffect, useState } from "react"
import { getUsers, updateUserRoles } from "../service/admin"
import { PageHeader } from "../components/common/PageHeader"
import { LoadingSpinner } from "../components/common/LoadingSpinner"
import { useAuth } from "../hooks/useAuth"
import { errMsg } from "../lib/constants"

const ALL_ROLES = ["CUSTOMER", "MECHANIC", "ADMIN"]

export const AdminUsers: React.FC = () => {
  const { user: me } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = () =>
    getUsers().then(setUsers).catch(() => notify("Failed to load users")).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const toggleRole = async (u: any, role: string) => {
    const roles = u.roles.includes(role) ? u.roles.filter((r: string) => r !== role) : [...u.roles, role]
    if (roles.length === 0) return notify("A user needs at least one role")
    try {
      const updated = await updateUserRoles(u._id, roles)
      setUsers(users.map((x) => (x._id === u._id ? updated : x)))
    } catch (err) {
      notify(errMsg(err))
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Users & Roles" description="Promote customers to mechanics or admins." />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-sm shadow-slate-200/60">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs uppercase font-bold">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Roles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="px-5 py-4 font-medium">{u.name}{u._id === me?.id && " (you)"}</td>
                  <td className="px-5 py-4 text-slate-600">{u.email}</td>
                  <td className="px-5 py-4 text-slate-500">{u.phone || "—"}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      {ALL_ROLES.map((r) => (
                        <button
                          key={r}
                          onClick={() => toggleRole(u, r)}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-md border transition ${
                            u.roles.includes(r)
                              ? "bg-brand-500 text-white border-blue-600"
                              : "bg-white text-slate-400 border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
