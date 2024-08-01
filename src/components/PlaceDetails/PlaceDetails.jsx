import React, { useState } from 'react'
import { Box, Typography, Button, Card, CardMedia, CardContent, CardActions, Chip, Modal, TextField, makeStyles } from "@material-ui/core";

// import useStyles from './style'
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import Rating from '@material-ui/lab/Rating';
import { motion } from 'framer-motion';


const useStyles = makeStyles((theme) => ({

  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 0,
  },
  button: {
    margin: theme.spacing(1),
  },
  chip: {
    margin: '5px 5px 5px 0',
  },
  subtitle: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px',
  },
  spacing: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
}));

const PlaceDetails = ({ place, isLoggedIn }) => {
  const classes = useStyles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [review, setReview] = useState('');
  // const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isReviewsVisible, setIsReviewsVisible] = useState(false)


  const togglePanel = () => {
    setIsReviewsVisible(!isReviewsVisible);
  };


  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  // Function to generate a unique place ID
  const generatePlaceId = (place) => `${place.name}-${place.address}`;


  // Function to handle review submission
  const handleReviewSubmit = async () => {
    const placeId = generatePlaceId(place);

    try {
      const response = await fetch('http://localhost:8080/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming the token is stored in localStorage
        },
        body: JSON.stringify({ placeId, reviewText: review })
      });
      console.log(response.json)


      // if (response.ok) {
      //   const newReview = await response.json();
      //   setReviews([...reviews, newReview]); // Update the reviews state with the new review
      //   console.log(reviews)
      //   setReview('');
      //   setIsModalOpen(false);
      // }
      if (response.ok) {
        const updatedReviews = await response.json();
        setReviews(updatedReviews.reviews); // Update the reviews state with the updated reviews
        setReview('');
        setIsModalOpen(false);
      } else {
        console.error('Error submitting review');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleSeeAllReviews = async () => {
    const placeId = generatePlaceId(place);

    try {
      const response = await fetch(`http://localhost:8080/api/reviews/${placeId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
        setIsReviewsVisible(true); // Assuming you want to toggle visibility of reviews

        console.log(data)
      } else {
        console.error('Error fetching reviews');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Card elevation={6} className={classes.root}>
      <CardMedia
          style={{ height: '450' }}
          image={place.photo && place.photo.images && place.photo.images.medium ?place.photo.images.medium.url : " https://media-cdn.tripadvisor.com/media/photo-s/0b/a1/47/28/fish-chips.jpg"}
        title={place.name}
      />

      <CardContent>
        <Typography gutterBottom variant="h5">
          {place.name}
        </Typography>
        <Box display="flex" justifyContent="space-between" my={2}>
          <Rating name="read-only" value={Number(place.rating)} readOnly />
          <Typography component="legend">
            {place.num_reviews} review{place.num_reviews > 1 && 's'}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5">Price</Typography>
          <Typography gutterBottom variant="subtitle1">
            {place.price_level}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5">Ranking</Typography>
          <Typography gutterBottom variant="subtitle1">
            {place.ranking}
          </Typography>
        </Box>
        {place?.awards?.map((award, index) => (
          <Box my={1} display="flex" justifyContent="space-between" key={index}>
            <img src={award.images.small} alt={award.display_name} />
            <Typography variant="subtitle2" color="textSecondary">
              {award.display_name}
            </Typography>
          </Box>
        ))}
        {place?.cuisine?.map(({ name }) => (
          <Chip key={name} size="small" label={name} className={classes.chip} />
        ))}
        {place.address && (
          <Typography gutterBottom variant="body2" color="textSecondary" className={classes.subtitle}>
            <LocationOnIcon />{place.address}
          </Typography>
        )}
        {place.phone && (
          <Typography variant="body2" color="textSecondary" className={classes.spacing}>
            <PhoneIcon /> {place.phone}
          </Typography>
        )}
        <CardActions>
          <Button size="small" color="primary" onClick={() => window.open(place.web_url, '_blank')}>
            TRIP ADVISOR
          </Button>
          <Button size="small" color="primary" onClick={() => window.open(place.website, '_blank')}>
            WEBSITE
          </Button>


          <Button size="small" color="primary" onClick={() => setIsModalOpen(true)}>
            Add Review
          </Button>


          {!isReviewsVisible ? (
            <Button size="small" color="primary" onClick={handleSeeAllReviews}>
              See All Reviews
            </Button>
          ) : (
            <motion.div
              className="fixed bottom-0 left-0 w-full md:w-1/3 lg:w-1/4 h-full bg-white shadow-lg"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{ zIndex: 1000 }} // Ensure the pane is on top
            >
              <div className="bg-blue-400 flex flex-col items-center justify-center py-10" style={{ zIndex: 1001 }}>
                <motion.div
                  className="bg-white shadow-lg rounded-lg p-6 lg:w-full md:w-full max-w-md"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex justify-between items-center">
                    <motion.h1
                      className="text-3xl font-extrabold mb-4 text-center text-blue-800"
                      initial={{ y: 0 }}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    >
                      Reviews
                    </motion.h1>
                    <button onClick={togglePanel} className="text-gray-600 hover:text-gray-800">
                      Close &times;
                    </button>
                  </div>
                  <Box mt={2}>
                    {reviews.length > 0 ? (
                      reviews.map((reviewData, index) => (
                        <Box key={index} mb={2}>
                          <Typography variant="body1">{reviewData.userName}</Typography>
                          {reviewData.reviews && reviewData.reviews.length > 0 ? (
                            reviewData.reviews.map((review, subIndex) => (
                              <Typography variant="body2" key={subIndex} color="textSecondary">
                                {review.reviewText}
                              </Typography>
                            ))
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              No reviews available
                            </Typography>
                          )}
                        </Box>
                      ))
                    ) : (
                      <Typography>No reviews yet.</Typography>
                    )}
                  </Box>
                </motion.div>
              </div>
            </motion.div>
          )}
        </CardActions>
      </CardContent>

      {/* Modal for adding a review */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="add-review-modal"
        aria-describedby="modal-to-add-review"
      >
        <div className={classes.modal}>
          <Typography variant="h6" gutterBottom>
            Add Your Review
          </Typography>
          <TextField
            label="Your Review"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={review}
            onChange={handleReviewChange}
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={() => setIsModalOpen(false)} color="primary" className={classes.button}>
              Cancel
            </Button>
            <Button onClick={handleReviewSubmit} color="secondary" className={classes.button}>
              Submit
            </Button>
          </Box>
        </div>
      </Modal>
    </Card>
  );
};

export default PlaceDetails;

