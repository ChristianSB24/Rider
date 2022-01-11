import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Routes, Route, Link } from 'react-router-dom'

import RiderDetail from './RiderDetail';
import RiderRequest from './RiderRequest';
import RiderDashboard from './RiderDashboard'

export const RiderLayout = () => {
    return (
        <Row>
            <Col lg={12}>
                <Routes>
                    <Route index element={<RiderDashboard />} />
                    <Route path='request' element={<RiderRequest />} />
                    <Route path=':id' element={<RiderDetail />} />
                </Routes>
            </Col>
        </Row>
    )
}