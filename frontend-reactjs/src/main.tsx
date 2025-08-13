import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import store from './redux/store.ts'
import { Provider } from "react-redux"
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster position='bottom-left' richColors/>
      <App />
    </Provider>
  </StrictMode>,
)
