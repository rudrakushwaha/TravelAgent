import React, { useEffect, useState } from 'react'
import { CssBaseline, Grid, ServerStyleSheets } from '@material-ui/core'

import { getPlacesData } from '../../api'
import Header from "../Header/Header"
import List from "../List/List"
import Map from "../Map/Map"
import Chat from '../Chat'

import { GoogleMap, LoadScript } from '@react-google-maps/api';
import GoogleMapsLoader from '../GoogleMapLoader/GoogleMapsLoader';


const Main = () => {


  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;



  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [places, setPlaces] = useState([]);
  const [childClicked, setChildClicked] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [bounds, setBounds] = useState({});
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoordinates({ lat: latitude, lng: longitude });
      setLoading(false);
      console.log({ lat: latitude, lng: longitude })

    });
  }, [])

  useEffect(() => {
    const filteredPlaces = places.filter((place) => place.rating > rating)

    setFilteredPlaces(filteredPlaces);
  }, [rating])

  // useEffect(()=>{
  //  console.log(coordinates,bounds);
  // console.log(bounds.sw)
  // console.log(bounds.ne);
  //   getPlacesData(bounds.sw, bounds.ne)
  //   .then((data)=>{
  //     console.log(data);
  //     setPlaces(data);
  //   })
  // },[coordinates,bounds])



  useEffect(() => {
    console.log(coordinates)
    console.log(bounds)
    if (bounds.sw && bounds.ne) {
      getPlacesData(type, bounds.sw, bounds.ne)
        .then((data) => {
          console.log(data);
          setPlaces(data?.filter((place) => place.name && place.num_reviews > 0))
          setPlaces(data);
          setFilteredPlaces([])
        });
    }
  }, [type, bounds]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while coordinates are being fetched
  }

  return (
    <>
      <GoogleMapsLoader apiKey={apiKey} libraries={['geometry', 'drawing', 'places']} />
    
    <div>
    <LoadScript googleMapsApiKey={apiKey} libraries={['geometry', 'drawing', 'places']}>

      <CssBaseline />
      <Header setCoordinates={setCoordinates} />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <List places={filteredPlaces.length ? filteredPlaces : places}
            childClicked={childClicked}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={places}
            setChildClicked={setChildClicked}
          />
        </Grid>
        <Chat />

      </Grid>
      </LoadScript>

    </div>
    </>
  )
}

export default Main