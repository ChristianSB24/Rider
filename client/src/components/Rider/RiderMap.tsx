import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Map from '../common/Map'
import TextField from '../FormComponents/TextField';

const RiderMap = () => {
    const [zoom, setZoom] = React.useState(12); // initial zoom
    const [lat, setLat] = useState(38.897957);
    const [lng, setLng] = useState(-77.036560);

    useEffect(() => {
        if (window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition((position) => {
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
            });
        }
    }, []);
    let height = (window.screen.height)
    return (
    <>
        <Link to='/' className='position-absolute map-arrow m-2'><i className="bi bi-arrow-left-circle-fill"></i></Link>
        <Map
            lat={lat} 
            lng={lng} 
            zoom={zoom} 
            pickUpAddress={''} 
            dropOffAddress={''} 
            className={{ width: '100%', height: `${height}px`}} />
        
        <div className='position-absolute map-input w-100 pb-5 pt-3 px-3 bg-white'>
            <Link to='/' className='text-decoration-none'><div className="w-100 p-2 px-3 bg-grey-secondary t1 fw-600">Search destination</div></Link>
        </div>
    </>
    )
}

export default RiderMap