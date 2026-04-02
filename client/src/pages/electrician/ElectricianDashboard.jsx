import { useState } from 'react'
import Sidebar from '../../components/electrician/Sidebar'
import Topbar from '../../components/electrician/Topbar'
import Toast from '../../components/shared/Toast'
import Overview from './Overview'
import MyJobs from './MyJobs'
import NearbyJobs from './NearbyJobs'
import JobHistory from './JobHistory'
import Stats from './Stats'
import Profile from './Profile'
import Location from './Location'

const PAGES = {
  overview: Overview,
  myjobs:   MyJobs,
  nearby:   NearbyJobs,
  history:  JobHistory,
  stats:    Stats,
  profile:  Profile,
  location: Location,
}

export default function ElectricianDashboard() {
  const [activePage, setActivePage] = useState('overview')
  const [online, setOnline]         = useState(true)

  const PageComponent = PAGES[activePage] || Overview

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <Topbar online={online} onToggle={() => setOnline(p => !p)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <main className="flex-1 overflow-y-auto p-6">
          <PageComponent />
        </main>
      </div>
      <Toast />
    </div>
  )
}