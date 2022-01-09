import React, { useContext } from 'react';
import {
  Button, Form, Navbar, Nav
} from 'react-bootstrap';
import { Link, Route, Routes, Navigate } from 'react-router-dom';
import _ from 'lodash'

import { isDriver, isRider } from './services/AuthService';
import { RequireAuth, getIsAuthorized, AccountContext } from './auth/Authorization'
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Driver from './components/Driver';
import { Rider } from './components/Rider';
import { NotFound } from './components/NotFound'
import RiderDashboard from './components/RiderDashboard'
import RiderDetail from './components/RiderDetail'
import RiderRequest from './components/RiderRequest';

function App() {
  const accountData = useContext(AccountContext)

  return (
    <div className="login-content">
      <Navbar bg='light' expand='lg' variant='light'>
        <Link to='/'>
          <Navbar.Brand >Taxi</Navbar.Brand>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse>
          {
            isRider() && (
              <Nav className='mr-auto'>
                <Link to='/rider/request'>Request a trip</Link>
              </Nav>
            )
          }
          {
             !_.isEmpty(accountData.accountData) && 
                <Form inline className='ml-auto'>
                  <Button
                    type='button'
                    onClick={() => accountData.logOut()}
                  >Log out</Button>
              </Form>
          }
        </Navbar.Collapse>
      </Navbar>
      <div className="d-flex max-width flex-column justify-content-center align-items-center px-2">
        <Routes>
          <Route path='/' element={
            <div className='middle-center'>
              <h1 className='landing logo'>Taxi</h1>
              {
                _.isEmpty(accountData.accountData) && (
                  <>
                    <Link
                      id='signUp'
                      className='btn btn-primary'
                      to='/sign-up'
                    >Sign up</Link>
                    <Link
                      id='logIn'
                      className='btn btn-primary'
                      to='/log-in'
                    >Log in</Link>
                  </>
                )
              }
              {
                isRider() && (
                  <Link
                    className='btn btn-primary'
                    to='/rider/dashboard'
                  >Dashboard</Link>
                )
              }
              {
                isDriver() && (
                  <Link
                    className='btn btn-primary'
                    to='/driver'
                  >Dashboard</Link>
                )
              }
            </div>
          } />
          <Route path='/sign-up' element={!_.isEmpty(accountData.accountData) ? <Navigate replace to={'/'}/> : <SignUp/>}/>
          <Route path='/log-in' element={!_.isEmpty(accountData.accountData) ? <Navigate replace to={'/'} /> : <LogIn />} />
          <Route path='/driver' element={<Driver />}/>
          <Route path='/rider' element={<RequireAuth> <Rider /></RequireAuth>}>
            <Route path='dashboard' element={<RiderDashboard />} />
            <Route path='request' element={<RiderRequest />} />
            <Route path=':id' element={<RiderDetail />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;