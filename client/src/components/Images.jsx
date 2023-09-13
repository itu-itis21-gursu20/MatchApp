import React, { useEffect, useState } from 'react'
import Image from './Image';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Images = ({ userId }) => {

   // const { currentUser } = useSelector( (state) => state.user );

    const [images, setImages] = useState([]);

    const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
    const currentUser = user && JSON.parse(user).currentUser;
    const TOKEN = currentUser?.accessToken;
  
    useEffect( () => {
      const fetchImages = async () => {
        try {
          const res = await axios.get(`/images/find/berkay/${userId}`, 
          {
            headers: {
              token: `Bearer ${TOKEN}`
            } 
          });
          setImages(res.data);
        } catch (err) {
          console.log(err);
        }
      }
      fetchImages();
    }, [userId])

  return (
    <>
      { images.map(image => (
        <Image key={image._id} image={image}/>
      ))}
    </>
  )
} 

export default Images