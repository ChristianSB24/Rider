import React from 'react';
import { Breadcrumb, Col, Row} from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom'

import RiderDetail from './RiderDetail';
import RiderRequest from './RiderRequest';
import RiderDashboard from './RiderDashboard'

export const RiderLayout = () => {
    return (
        <>
            <Row>
                <Col lg={12}>
                    <Breadcrumb>
                        <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
                        <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>
            <Routes>
                <Route index element={<RiderDashboard />}/>
                <Route path='request' element={<RiderRequest />} />
                <Route path=':id' element={<RiderDetail />} />
            </Routes>
        </>
    )
}