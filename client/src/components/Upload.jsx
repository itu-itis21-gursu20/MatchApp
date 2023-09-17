import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from "firebase/storage";
import app from "../firebase";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { userRequest } from '../requestMethods';

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: gray;
  color: blue;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const Title = styled.h1`
text-align: center;
`;

const Input = styled.input`
  border: 1px solid black;
  color: blue;
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Desc = styled.textarea`
  border: 1px solid gray;
  color: green;
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: pink;
  color: purple;
`;

const Label = styled.label`
  font-size: 14px;
`;

export const Upload = ({setOpen}) => {

    const [img, setImg] = useState(undefined);
    const [imgPerc, setImgPerc] = useState(0);
    const [inputs, setInputs] = useState({});

    const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
    const currentUser = user && JSON.parse(user).currentUser;
    const TOKEN = currentUser?.accessToken;

    const navigate = useNavigate();

    const handleChange = (e) => {
      setInputs((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
      });
    };

    const uploadFile = (file, urlType) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("upload is " + progress + "% done.");
          setImgPerc(Math.round((progress)));
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              break;
          }
          }, 
          (error) => {console.log(error)},
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setInputs((prev) => {
                return { ...prev, [urlType]: downloadURL };
              });
            });
          }
        )
    };
    

    
    useEffect( () => {  
      img && uploadFile(img, "imgUrl");
    }, [img]);
    


    const handleUpload = async (e) => {
      e.preventDefault();
      console.log("handleUpload")
      // const res = await axios.post("/images/", 
      //   { ...inputs }, 
      //   {
      //     headers: {
      //       token: `Bearer ${TOKEN}`
      //     }
      //   })
        const res = await userRequest.post("/images/", { ...inputs })
      setOpen(false);
    }

    return (
      <Container>
        <Wrapper>
          <Close onClick={() => setOpen(false)}>X</Close>
          <Title>Upload a New Photo</Title>
          <Label>Image:</Label>
          {imgPerc > 0 ? (
            "Uploading:" + imgPerc + "%"
          ) : (
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImg(e.target.files[0])}
            />
          )}
          <Input
            type="text"
            placeholder="Title"
            name="title"
            onChange={handleChange}
          />
          <Desc
            placeholder="Description"
            name="desc"
            rows={8}
            onChange={handleChange}
          />
          <Button onClick={handleUpload}>Upload</Button>
        </Wrapper>
      </Container>
    )
}
