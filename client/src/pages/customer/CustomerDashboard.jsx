import { useState, useCallback } from 'react'
import CustomerSidebar from './CustomerSidebar'
import CustomerTopbar from './CustomerTopbar'
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
  const [activePage, setActivePage] = useState('home')
  const [selectedId, setSelectedId] = useState(null)
  const [history,    setHistory]    = useState(['home'])

  const navigateTo = useCallback((page, id = null) => {
    setHistory(prev => [...prev, page])
    setSelectedId(id)
    setActivePage(page)
  }, [])

  const goBack = useCallback(() => {
    setHistory(prev => {
      if (prev.length <= 1) return prev
      const newHistory = prev.slice(0, -1)
      const prevPage   = newHistory[newHistory.length - 1]
      setActivePage(prevPage)
      setSelectedId(null)
      return newHistory
    })
  }, [])

  const PageComponent = PAGES[activePage] || Home

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <CustomerTopbar onNavigate={navigateTo} />
      <div className="flex flex-1 overflow-hidden">
        <CustomerSidebar activePage={activePage} onNavigate={navigateTo} />
        <main className="flex-1 overflow-y-auto p-6">
          <PageComponent
            onNavigate={navigateTo}
            onBack={goBack}
            selectedId={selectedId}
          />
        </main>
      </div>
      <Toast slice="customer" />
    </div>
  )
}