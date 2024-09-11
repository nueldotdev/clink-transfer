import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Signup from '../pages/index/Signup'
import IndexPage from '../pages/index/IndexPage'
import EmailPage from '../pages/index/EmailPage'
import Verify from '../pages/index/Verify'
import Layout from '../components/Layout'
import HomePage from '../pages/app/HomePage'
import Devices from '../pages/app/Devices'
import Pods from '../pages/app/Pods'
import Account from '../pages/app/Account'
import Login from '../pages/index/Login'


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<IndexPage />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-sent' element={<EmailPage />} />
        <Route path='/verify' element={<Verify />} />
      </Routes>
      <Routes>
        <Route path='/app' element={<Layout />} >
          <Route index element={<HomePage />} />
          <Route path='/app/devices' element={<Devices />} />
          <Route path='/app/pods' element={<Pods />} />
          <Route path='/app/account' element={<Account />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default AppRouter