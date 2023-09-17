import React, { useContext, useEffect, useRef, useState } from 'react'
import Image from '../components/Image'
import Versus from '../components/Versus'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link, useNavigate, useHistory } from 'react-router-dom'
import { Card } from 'flowbite-react'
import { Button } from 'flowbite-react'
import { publicRequest, userRequest } from '../requestMethods'
import { ChatContext } from '../context/ChatContext'
import "./duel.css";

const Duel = () => {

  //console.log("socket duel", socket);
  const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUser = user && JSON.parse(user).currentUser;
  const TOKEN = currentUser?.accessToken;

  // const [images, setImages] = useState([]);
  // const [displayedImages, setDisplayedImages] = useState([]);
  const [userToGo, setUserToGo] = useState({});

  const navigate = useNavigate();

  const { handleImageClick, displayedImages, selectedImageId } = useContext(ChatContext);

  const handlePlayAgain = () => {
    navigate('/duel'); // Navigate to /duel
    window.location.reload(); // Force a reload
  }

  // useEffect(() => {
  //   // Fetch images from the API when the component mounts
  //   const fetchImages = async () => {
  //     try {
  //       // const response = await axios.get(`images/random/${currentUser._id}`, 
  //       // {
  //       //       headers: {
  //       //         token: `Bearer ${TOKEN}`
  //       //       } 
  //       // }
  //       // ); 
  //       const response = await userRequest.get(`images/random/${currentUser?._id}`); 

  //       const fetchedImages = response.data;
  //       setImages(fetchedImages);
  //       setDisplayedImages([fetchedImages[0], fetchedImages[1]]);
  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //   };
  //   fetchImages();
  // }, []);  // The empty dependency array means this useEffect runs once when the component mounts

  // useEffect(() => {
  //   setImages(images);
  // },[images]);

  // useEffect(() => {
  //   setDisplayedImages(displayedImages);
  // },[displayedImages]);




  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current) {
      setTimeout(() => {
        imgRef.current.classList.remove('translate-y-10', 'opacity-0');
      }, 50);  // delay to ensure the transition triggers
    }
  }, []);

  const handleClick = async (imageId) => {
    try {
      // const res = await axios.get(`/users/find/mahmut/${imageId}`,
      // {
      //   headers: {
      //     token: `Bearer ${TOKEN}`
      //   } 
      // })
      const res = await userRequest.get(`/users/find/mahmut/${imageId}`)
      navigate(`/users/${res.data._id}`);
    } catch (error) {
      console.log(error);
    }
  }

  console.log("displayedImages", displayedImages);


  return (
    <>
      <div className='flex flex-wrap justify-center'>
          {displayedImages.map((image, index) => (
            <React.Fragment key={image._id}>
              <div className={`p-2 flex items-center justify-between ${displayedImages.length === 1 ? 'w-full flex-row h-50' : 'w-1/3 flex-col'} h-200`}>
                <img 
                  ref={imgRef} 
                  src={image.imgUrl} 
                  className={`${displayedImages.length === 1 ? 'h-100 w-100' : 'h-150 w-full object-cover mx-auto'} ${image._id === selectedImageId ? 'scale-up' : 'scale-down'}`}                  alt="pic" />

                <Card className={`${displayedImages.length === 1 ? 'flex flex-col justify-center items-center text-center' : ''}`}>

                  {displayedImages.length === 1 && <p className='text-center'>Game over! Thanks for playing.</p>} 

                  <div className='text-center'>Points: {image.point}</div>

                  <button className={`mt-2 px-4 py-2 bg-blue-500 text-white rounded ${displayedImages.length === 1 ? 'invisible' : 'visible'}`} onClick={() => handleImageClick(image)}>select</button>

                  {displayedImages.length === 1 && (
                    <>
                      <button onClick={() => handleClick(image._id)}>GO TO THIS USER'S PAGE</button>
                      <button onClick={handlePlayAgain}>PLAY AGAIN</button>
                    </>
                  )} 

                </Card>

              </div>

              {/* Insert Versus image after the first image */}
              {index === 0 && displayedImages.length > 1 && (
                <div className='flex flex-col w-1/3 justify-center items-center'>
                  <Link to="/"><Button className="p-4 font-bold text-lg">EXIT THE DUEL</Button></Link> 
                  <Versus />
                </div>
                )}
            </React.Fragment>
          ))}
      </div>
    </>
  )
}

export default Duel;




{/* <div className='flex flex-wrap justify-center h-screen'>
{displayedImages.map(image => (
  <div className={`p-2 flex flex-col items-center justify-between ${displayedImages.length === 1 ? 'w-full' : 'w-1/2'} h-200`} key={image._id}>
    {displayedImages.length === 1 && <p className='text-center'>Game over! Thanks for playing.</p>}
    <img src={image.imgUrl} className='w-full h-150 object-cover mx-auto' alt="pic" />
    <div>
      <div className='text-center'>Points: {image.point}</div>
      <button className='mt-2 px-4 py-2 bg-blue-500 text-white rounded' onClick={() => handleImageClick(image)}>select</button>
    </div>
  </div>
))}
</div> */}

{/* <div className='flex flex-wrap'>
{displayedImages.map(image => (
  <div className='w-1/2 p-2 flex flex-col items-center justify-between h-200' key={image._id}>
    {displayedImages.length === 1 && <p className='text-center'>Game over! Thanks for playing.</p>}
    <img src={image.imgUrl} className='w-full h-150 object-cover' alt="pic" />
    <div>
      <div className='text-center'>Points: {image.point}</div>
      <button className='mt-2 px-4 py-2 bg-blue-500 text-white rounded' onClick={() => handleImageClick(image)}>select</button>
      </div>
  </div>
))}
</div> */}



// seçileni ve seçilmeyeni alırız, seçilmeyeni imagestan çıkarırız 
// beşiktaş vs gs geldi, beşiktaş seçildi, yeni rakip updatesImagesteki bjk ve gs dışında herhangi bir takım olabilir 


// const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
//   const currentUser = user && JSON.parse(user).currentUser;
//   const TOKEN = currentUser?.accessToken;

//   const [images, setImages] = useState([]);
//   const [selectedImage, setSelectedImage] = useState({});

//   useEffect( () => { // sayfa açıldığında
//     const getRandomImages = async () => { // dbdeki tüm imagelar yüklensin
//         try {
//         const res = await axios.get("images/random", {
//           headers: {
//             token: `Bearer ${TOKEN}`
//           } 
//         });
//         console.log("first useEffect");
//         setImages(res.data);
//         }
//       catch (err) {
//         console.log(err);
//       }
//     }
//     getRandomImages();    
//   }, []);

//   const [currentPair, setCurrentPair] = useState([]);

//   useEffect(() => {
//       setCurrentPair(images.slice(0, 2));
//       console.log("second useEffect");
//   }, [images]);


  


// const handleSelect = async (e) => {

//   const selectedImage = JSON.parse(e.currentTarget.value);
//   try {
//     const res = await axios.get(`images/point/${selectedImage._id}`, {
//       headers: {
//         token: `Bearer ${TOKEN}`
//       } 
//     })

//     const unselectedImage = currentPair.find(img => img._id !== selectedImage._id);

//     const updatedImages = images.filter(img => img._id !== unselectedImage._id);

//     // const updatedCurrentPair = currentPair.filter(img => img._id !== unselectedImage._id);
//     const updatedCurrentPair = [];

//     // Fetch a new random image from the server and append to the updatedImages array
//     const newImageRes = await axios.get("images/random_1", {
//       headers: {
//         token: `Bearer ${TOKEN}`
//       } 
//     });

//     const selected = await axios.get(`images/find/${selectedImage._id}`, {
//       headers: {
//         token: `Bearer ${TOKEN}`
//       } 
//     });

//     console.log("selected.data",selected.data);
//     console.log("newImageRes.data[0]",newImageRes.data[0]);
//     console.log("updatedCurrentPair", updatedCurrentPair);
//     updatedCurrentPair.push(selected.data);
//     updatedCurrentPair.push(newImageRes.data[0]);
//     console.log("lastupdatedCurrentPair", updatedCurrentPair);
//     setCurrentPair(updatedCurrentPair);
//     setImages(updatedImages);
//     console.log("currentPair",currentPair);
//     console.log("updatedImages",updatedImages);


//   } catch (err) {
//     console.log(err);
//   }
// }

// <div className='flex justify-around mt-6'>
     
// { currentPair.map( image => (
//        <div className='flex flex-col'>
//            <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
//              <a href="#">
//                  <img className="rounded-t-lg" src={image.imgUrl} alt="" />
//              </a>
//              <div className="p-5">
//                  <a href="#">
//                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technology acquisitions 2021</h5>
//                  </a>
//                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
         
//              </div>
//            </div>
//            <button key={image._id} value={JSON.stringify(image)} onClick={handleSelect} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
//              Select
//            </button>
//            <div>{image.point}</div>
//        </div>
//      ))}
//    </div>

