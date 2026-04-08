import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import store from './store/store'
import App from './App.jsx'
import './index.css'

// ✅ Theme on initial load
const savedTheme = localStorage.getItem('theme') || 'light'
if (savedTheme === 'dark') document.documentElement.classList.add('dark')

// ✅ Theme sync on Redux state change
store.subscribe(() => {
  const mode = store.getState().theme?.mode
  if (mode === 'dark') document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)