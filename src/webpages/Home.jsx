import Header from './Header';
import Footer from './Footer';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import Slider from "react-slick";


const Home = () => {
    const sliderImages = [
        '/images/slider1.jpg',
        '/images/slider2.jpg',
      ];
    
      const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
      };

  return (
    <>
      <Box sx={{ width:1270 }}>
    
      <Header />

         {/* Slider Section */}
      <Box sx={{ mt: 2,width:1270 }}>
        <Slider {...settings}>
          {sliderImages.map((img, index) => (
            <Box key={index}>
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      <Container sx={{ py: 5, }}>
        {/* Info Section */}
        <Typography variant="h4" gutterBottom align="center">
          Welcome to RideEase
        </Typography>
        <Typography variant="body1" align="center" maxWidth="md" mx="auto">
          We offer reliable and affordable vehicle rental services across the city. Whether you're traveling for work or leisure, RideEase has got you covered.
        </Typography>

        <Typography variant="body1" >
          DriveEase Rentals is a trusted vehicle rental company offering a wide range of cars, autos, and bikes for hire at affordable prices.
          Book your ride with ease and travel comfortably.
        </Typography>

        {/* Testimonials */}
        <Box sx={{ my: 5 }}>
          <Typography variant="h5" gutterBottom align="center">
            What Our Customers Say
          </Typography>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                <img src="/images/testimonials.jpg" alt="Testimonial" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  “The service was fantastic! The car was clean and the pickup process was smooth.”
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  - Ravi, Bengaluru
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>

      

      <Footer />
      </Box>
    </>
  );
};

export default Home;
