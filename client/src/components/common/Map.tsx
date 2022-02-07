import React, { useState, useRef } from 'react';
import {
  Circle,
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  LoadScript,
  Marker,
  Polygon,
} from '@react-google-maps/api';

interface MapSelection {
  lat: number,
  lng: number,
  zoom: number,
  pickUpAddress: string,
  dropOffAddress: string,
}

function Map(props: MapSelection) {
  const [response, setResponse] = useState(null);
  const [map, setMap] = useState<any>({})
  const [radius, setRadius] = useState<any>(122)

  const onZoomChanged = () => {
    if(map?.zoom) {
      setRadius(.12/(Math.pow(2, map.zoom - 22)))
    }
  }

  const hasTwoAddresses = (
    props.pickUpAddress !== '' &&
    props.dropOffAddress !== ''
  );

  const directionsCallback = (response: any) => {
    if (response !== null && response.status === 'OK') {
      setResponse(response);
    }
  };

  const paths = [
    { lat: 25.774, lng: -80.19 },
    { lat: 18.466, lng: -66.118 },
    { lat: 32.321, lng: -64.757 },
    { lat: 25.774, lng: -80.19 }
  ]

  return (
    <LoadScript
      googleMapsApiKey={`${process.env.REACT_APP_GOOGLE_MAPS_KEY}`}
      preventGoogleFontsLoading={true}
    >
      <GoogleMap
        clickableIcons={false}
        onLoad={map => { setMap(map)
        }}
        onZoomChanged={onZoomChanged}
        options={{ mapId: "ceaf38b32a54a2cb", disableDefaultUI: true }}
        center={{
          lat: props.lat,
          lng: props.lng
        }}
        mapContainerStyle={{
          borderRadius: '10px',
          width: '100%',
          height: '200px',
          marginBottom: '10px'
        }}
        zoom={props.zoom}
      >
        {
          hasTwoAddresses && response === null && (
            <DirectionsService
              options={{
                origin: props.pickUpAddress,
                destination: props.dropOffAddress,
                travelMode: google.maps.TravelMode.DRIVING
              }}
              callback={directionsCallback}
            >
            </DirectionsService>
          )
        }
        {
          hasTwoAddresses && response !== null && (
            <DirectionsRenderer
              options={{
                directions: response
              }}
            />
          )
        }
        {
          !hasTwoAddresses && (
            <>
              <Circle
                center={{
                  lat: props.lat,
                  lng: props.lng
                }}
                radius={50}
                options={{ fillColor: '#4285F4', strokeColor: '#ffffff', strokeWeight: 2, fillOpacity: 0.35, }}
              />
              <Circle
                center={{
                  lat: props.lat,
                  lng: props.lng
                }}
                radius={radius}
                options={{ fillColor: '#4A89F3', strokeColor: '#4A89F3', strokeWeight: 2, fillOpacity: 1, strokeOpacity:1 }}
              />
              {/* <Marker
              position={{
                lat: props.lat,
                lng: props.lng
              }}
            >
            </Marker> */}
            </>
          )
        }
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;