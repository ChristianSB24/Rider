import React, { useState, useRef } from 'react';
import {
  Circle,
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  LoadScript,
  Marker,
} from '@react-google-maps/api';

interface MapSelection {
  className?: object,
  lat: number,
  lng: number,
  zoom: number,
  pickUpAddress: string,
  dropOffAddress: string,
}

function Map(props: MapSelection) {
  const [response, setResponse] = useState(null);
  const [map, setMap] = useState<any>({})

  const hasTwoAddresses = (
    props.pickUpAddress !== '' &&
    props.dropOffAddress !== ''
  );

  const directionsCallback = (response: any) => {
    if (response !== null && response.status === 'OK') {
      setResponse(response);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={`${process.env.REACT_APP_GOOGLE_MAPS_KEY}`}
      preventGoogleFontsLoading={true}
    >
      <GoogleMap
        clickableIcons={false}
        options={{ mapId: "ceaf38b32a54a2cb", disableDefaultUI: true }}
        center={{
          lat: props.lat,
          lng: props.lng
        }}
        mapContainerStyle={props.className}
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
              <Marker
                position={{
                  lat: props.lat,
                  lng: props.lng
                }}
                icon='https://www.robotwoods.com/dev/misc/bluecircle.png'
              />
            </>
          )
        }
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;