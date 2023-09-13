'use client';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'flowbite-react';
import { Carousel } from 'flowbite-react';

import { Alert } from 'flowbite-react';

const Main = () => {

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
    const currentUser = user && JSON.parse(user).currentUser;
    const TOKEN = currentUser?.accessToken;

    const [images, setImages] = useState([]);

    useEffect(() => {
        // Fetch images from the API when the component mounts
        const fetchImages = async () => {
          try {
            const response = await axios.get(`images/random/${currentUser._id}`, 
            {
                  headers: {
                    token: `Bearer ${TOKEN}`
                  } 
            }
            );  // Adjust the endpoint as needed
    
            const fetchedImages = response.data;
            setImages(fetchedImages);
          } catch (error) {
            console.error('Error:', error);
          }
        };
        fetchImages();
      }, []);  // The empty dependency array means this useEffect runs once when the component mounts

  return (
    <div className='h-96'>
    <Carousel slideInterval={3000} >
        { images.map( image => (
            <img
                alt="..."
                src={image.imgUrl}
                className='w-auto h-96 object-cover'
            />
        ))}
    </Carousel>
    </div>

  )
}

export default Main