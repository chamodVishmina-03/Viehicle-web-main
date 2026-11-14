import React from "react"

export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center py-20">
    <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin" />
  </div>
)
