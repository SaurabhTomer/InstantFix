import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import CustomerSidebar  from './CustomerSidebar'
import CustomerTopbar   from './CustomerTopbar'
import Toast            from '../../components/shared/Toast'
import Home             from './Home'
import CreateRequest    from './CreateRequest'
import MyRequests       from './MyRequests'
import RequestDetail    from './RequestDetail'
import CustomerProfile  from './CustomerProfile'
import ChatPage         from './ChatPage'
import FloatingChat     from '../../components/shared/FloatingChat'

export default function CustomerDashboard() {
  const navigate     = useNavigate()
  const { pathname } = useLocation()

  const navigateTo = (page, id = null) => {
    if      (page === 'home')          navigate('/customer')
    else if (page === 'createRequest') navigate('/customer/create-request', { state: { category: id } })
    else if (page === 'myRequests')    navigate('/customer/requests')
    else if (page === 'requestDetail') navigate(`/customer/requests/${id}`)
    else if (page === 'profile')       navigate('/customer/profile')
    else if (page === 'chat')          navigate('/customer/chat')
  }

  const activePage =
    pathname.includes('create-request') ? 'createRequest' :
    pathname.includes('chat')           ? 'chat'          :
    pathname.includes('requests')       ? 'myRequests'    :
    pathname.includes('profile')        ? 'profile'       : 'home'

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <CustomerTopbar onNavigate={navigateTo} />
      <div className="flex flex-1 overflow-hidden">
        <CustomerSidebar activePage={activePage} onNavigate={navigateTo} />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/"               element={<Home            onNavigate={navigateTo} />} />
            <Route path="/create-request" element={<CreateRequest   onNavigate={navigateTo} />} />
            <Route path="/requests"       element={<MyRequests      onNavigate={navigateTo} />} />
            <Route path="/requests/:id"   element={<RequestDetail   onNavigate={navigateTo} />} />
            <Route path="/profile"        element={<CustomerProfile onNavigate={navigateTo} />} />
            <Route path="/chat"           element={<ChatPage />} />
          </Routes>
        </main>
      </div>
      <Toast slice="customer" />
      {!pathname.includes('chat') && <FloatingChat />}
    </div>
  )
}