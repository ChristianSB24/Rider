import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

const Header = ({ auth }: any) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to='/' className="navbar-brand">Taxi</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <ul className="navbar-nav">
                    {auth.userInfo.group === 'rider' &&
                        <li className='me-auto navbar-nav'>
                            <Link to='/rider/request'>Request a trip</Link>
                        </li>}
                    {!_.isEmpty(auth.userInfo) &&
                        <li className='me-auto nav-item'>
                            <button type='button' className="btn btn-primary" onClick={() => auth.logOut()}>Log out</button>
                        </li>
                    }
                </ul>
            </div>
        </nav>)
}

export default Header