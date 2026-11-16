import React from "react"
import { Outlet } from "react-router-dom"
import { Header } from "./Header"
import { Footer } from "./Footer"

export const MainLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 animate-fade-up">
      <Outlet />
    </main>
    <Footer />
  </div>
)
