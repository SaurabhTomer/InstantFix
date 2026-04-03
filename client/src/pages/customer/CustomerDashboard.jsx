import { useState } from 'react'
import CustomerSidebar from '../../components/customer/CustomerSidebar'
import CustomerTopbar from '../../components/customer/CustomerTopbar'
import Toast from '../../components/shared/Toast'
import Home from './Home'
import CreateRequest from './CreateRequest'
import MyRequests from './MyRequests'
import RequestDetail from './RequestDetail'
import CustomerProfile from './CustomerProfile'

const PAGES = {
  home:          Home,
  createRequest: CreateRequest,
  myRequests:    MyRequests,
  requestDetail: RequestDetail,
  profile:       CustomerProfile,
}

export default function CustomerDashboard() {
  const [activePage, setActivePage]   = useState('home')
  const [selectedId, setSelectedId]   = useState(null)

  const navigateTo = (page, id = null) => {
    setSelectedId(id)
    setActivePage(page)
  }

  const PageComponent = PAGES[activePage] || Home

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <CustomerTopbar onNavigate={navigateTo} />
      <div className="flex flex-1 overflow-hidden">
        <CustomerSidebar activePage={activePage} onNavigate={navigateTo} />
        <main className="flex-1 overflow-y-auto p-6">
          <PageComponent
            onNavigate={navigateTo}
            selectedId={selectedId}
          />
        </main>
      </div>
      <Toast slice="customer" />
    </div>
  )
}