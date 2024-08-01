import React from 'react'
import GoogleMapReact from "google-map-react"
import {Paper,Typography,useMediaQuery} from "@material-ui/core"
import Rating from "@material-ui/lab/Rating"; 
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';




import useStyles from "./style"
import mapStyles from './mapStyles';


const Map = ({setCoordinates,setBounds,coordinates,places,setChildClicked}) => {
const classes=useStyles()
const isDesktop = useMediaQuery('(min-width:600px)');
const margin = [50, 50, 50, 50];
// const coordinates={lat:0,lng:0};


const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  return (
   
      
    <div className={classes.mapContainer}>
    
      <GoogleMapReact
      bootstrapURLKeys={{key:process.env.REACT_APP_GOOGLE_MAPS_API_KEY}}
      // defaultCenter={coordinates}
      center={coordinates} 
      defaultZoom={14}
      margin={margin}
      options={{ disableDefaultUI: true, zoomControl: true, styles: mapStyles }}
      
      onChange={(e)=>{
        console.log(e)
        setCoordinates({ lat:e.center.lat, lng:e.center.lng});
        setBounds({sw:e.marginBounds.sw,ne:e.marginBounds.ne })
      }} 
      onChildClick={(child)=> setChildClicked(child)}
      >
        {places?.map((place,i)=>(
          <div className={classes.markerContainer} lat={Number(place.latitude)} lng={Number(place.longitude)} key={i}>
              {
                !isDesktop ? (
                  <LocationOnOutlinedIcon color="primary" fontSize='large' />
                ):(
                  <Paper elevation={3} className={classes.paper}>
                    <Typography className={classes.typography} variant='subtitle2' gutterBottom >
                        {place.name}
                    </Typography>
                    <Rating size="small" value={Number(place.rating)} readOnly />
                  </Paper>

                )
              }
          </div>
        ))}
      </GoogleMapReact>
    
    </div>

  )
}

export default Map