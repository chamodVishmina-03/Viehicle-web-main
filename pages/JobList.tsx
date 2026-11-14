import { notify } from "../lib/toast"
import React, { useEffect, useState } from "react"
import { getMyJobs, getAssignedJobs } from "../service/job"
import { PageHeader } from "../components/common/PageHeader"
import { JobTable } from "../components/job/JobTable"
import { Pagination } from "../components/common/Pagination"
import { StatusFilter } from "../components/common/StatusFilter"
import { LoadingSpinner } from "../components/common/LoadingSpinner"

// One component for both "my services" (customer) and "my assignments" (mechanic)
export const JobList: React.FC<{ mode: "customer" | "mechanic" }> = ({ mode }) => {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState("")

  useEffect(() => {
    setLoading(true)
    const load = mode === "customer" ? getMyJobs : getAssignedJobs
    load(page, 10, status)
      .then((res) => {
        setJobs(res.data)
        setTotalPages(res.meta.totalPages)
      })
      .catch(() => notify("Failed to load jobs"))
      .finally(() => setLoading(false))
  }, [page, status, mode])

  return (
    <div className="space-y-6">
      <PageHeader
        title={mode === "customer" ? "My Service Jobs" : "My Assignments"}
        description={
          mode === "customer"
            ? "Track the progress of your repairs."
            : "Jobs assigned to you by the service manager."
        }
        actionLabel={mode === "customer" ? "+ Book Service" : undefined}
        actionLink={mode === "customer" ? "/book" : undefined}
      />
      <StatusFilter value={status} onChange={(v) => { setStatus(v); setPage(1) }} />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <JobTable jobs={jobs} showMechanic={mode === "customer"} showCustomer={mode === "mechanic"} />
      )}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  )
}
