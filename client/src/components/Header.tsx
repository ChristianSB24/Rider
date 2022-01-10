import React from 'react';
import {
    Button, Navbar, Nav
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import _ from 'lodash';


export const Header = ({ auth }: any) => {
    return (<Navbar bg='light' expand='lg' variant='light'>
        <Link to='/'>
            <Navbar.Brand >Taxi</Navbar.Brand>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse>
            {auth.userInfo.group === 'rider' && <Nav className='me-auto'><Link to='/rider/request'>Request a trip</Link></Nav>}
            {!_.isEmpty(auth.userInfo) && 
                <div className='ms-auto'>
                    <Button type='button' onClick={() => auth.logOut()}>Log out</Button>
                </div>
            }
        </Navbar.Collapse>
    </Navbar>)
}