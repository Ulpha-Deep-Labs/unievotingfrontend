import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App.jsx';
import './main.css'
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

// if (process.env.NODE_ENV === 'production') 
disableReactDevTools()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)