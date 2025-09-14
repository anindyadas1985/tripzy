import React from 'react'
import { Shield } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Journai Admin Console</h1>
          <p className="text-slate-400">Administrative Dashboard</p>
        </div>
      </div>
    </div>
  )
}

export default App