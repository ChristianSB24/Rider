import React, { useState } from 'react';
import {
  Button, Form, Navbar, Nav
} from 'react-bootstrap';
import { Link, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Ok, Err, Result } from 'ts-results';

import { isDriver, isRider } from './services/AuthService';
import { RequireAuth, getIsAuthorized } from './auth/Authorization'
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Driver from './components/Driver';
import { Rider } from './components/Rider';

type Errors = "CANNOT_AUTHORIZE";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(() => {
    return window.localStorage.getItem('taxi.auth') !== null;
  });

  const navigate = useNavigate()

  const logIn = async (username: string, password: string): Promise<Result<object, Errors>> => {
    const url = `${process.env.REACT_APP_BASE_URL}/api/log_in/`;
    try {
      const response = await axios.post(url, { username, password });
      window.localStorage.setItem(
        'taxi.auth', JSON.stringify(response.data)
      );
      setLoggedIn(true);
      return Ok({ response });
    }
    catch (error) {
      console.error(error);
      return Err("CANNOT_AUTHORIZE");
    }
  };

  const logOut = () => {
    window.localStorage.removeItem('taxi.auth');
    navigate('/')
    setLoggedIn(false);
  };

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
             getIsAuthorized() && 
                <Form inline className='ml-auto'>
                  <Button
                    type='button'
                    onClick={() => logOut()}
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
                !getIsAuthorized() && (
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
                    to='/rider'
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
          <Route path='/sign-up' element={getIsAuthorized() ? <Navigate replace to={'/'}/> : <SignUp/>}/>
          <Route path='/log-in' element={getIsAuthorized() ? <Navigate replace to={'/'} /> : <LogIn logIn={logIn}/>} />
          <Route path='/driver' element={<Driver />}/>
          <Route path='/rider' element={<RequireAuth> <Rider /></RequireAuth>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;