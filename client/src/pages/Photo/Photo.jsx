import { Link, useLocation } from "react-router-dom";
import "./photo.css";
import { userRequest } from "../../requestMethods";
import { useContext, useEffect, useRef, useState } from "react";
import { 
    getStorage, 
    ref, 
    uploadBytesResumable, 
    getDownloadURL 
  } from "firebase/storage";
  import app from "../../firebase";
//import { Publish } from "@material-ui/icons";
import { Alert } from "@material-tailwind/react";
import { ChatContext } from "../../context/ChatContext";

export default function Photo() {

    const [img, setImg] = useState(null);  // undefined
    const [imgPerc, setImgPerc] = useState(0);
    const [inputs, setInputs] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const fileInputRef = useRef(null);

    const { socket } = useContext(ChatContext);

    const handleChange = (e) => {
        console.log("e.target: " + e.target);
        setInputs((prev) => {
          return { ...prev, [e.target.name]: e.target.value };
        });
    };

    const uploadFile = (file, urlType) => {
        setIsUploading(true);
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
            (error) => {
                console.log(error);
                setIsUploading(false);
                setImgPerc(0); // Reset upload percentage
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setInputs((prev) => {
                    return { ...prev, [urlType]: downloadURL };
                });
                setIsUploading(false);
                });
            }
            )
    };

    useEffect( () => {  
        img && uploadFile(img, "imgUrl");
      }, [img]);
      
      if(isAdded) {
        fileInputRef.current.value = "";  
      }

      const [addedImage, setAddedImage] = useState(null);
  
    const handleUpload = async (e) => {
        e.preventDefault();
        console.log("handleUpload")
        console.log("inputs", inputs);
        try {
            const res = await userRequest.post("/images/", { ...inputs })
            if(res.data) {
                setIsAdded(true);
                setAddedImage(res.data);
            }
        } catch (err) {
            console.log(err);
        }
    }

    // const [msg, setMsg] = useState(null);
    // const [updatedUser, setUpdatedUser] = useState(null);


    useEffect(() => {
      socket?.emit("berkay", addedImage);
    }, [isAdded]);
    
    // useEffect(() => {
    //   socket?.on("gursu", (msg) => {
    //     console.log("msg", msg);

    //   });
    // }, [socket]);

    // useEffect(() => {
    //   const fetchUser = async () => {
    //     try {
    //       const res = await userRequest.get(`/users/find/64d3f154295fbbba976570de`);
    //       console.log("res.data", res.data);
    //       setUpdatedUser(res.data);
    //     } catch (err) {
    //       console.log(err);
    //     }
    //   }
    // },[msg])




  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Photo</h1>
      </div>
      <div className="productBottom">
        <form className="productForm">
          <div className="productFormLeft">

            <label>Photo Title</label>
            <input type="text" placeholder="Title" name="title" onChange={handleChange}/>

            <label>Photo Description</label>
            <input type="text" placeholder="Description" name="desc" onChange={handleChange}/>

            <label>Photo</label>
            <input type="file"  accept="image/*" onChange={(e) => setImg(e.target.files[0])} ref={fileInputRef}/>
            <div className="progressBarContainer">
                <div className="progressBar" style={{ width: `${imgPerc}%` }}>
                    {imgPerc}%
                </div>
            </div>
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <img
                src=""
                alt=""
                className="productUploadImg"
              />
              <label for="file">
                
              </label>
              <input type="file" id="file" style={{ display: "none" }} />
            </div>
            <button className="productButton" onClick={handleUpload} disabled={isUploading || imgPerc < 100}>
               
                {isUploading ? "Uploading..." : "Upload"}
            </button>
            {isAdded && <Alert color="green">Photo has been added successfully</Alert>}
          </div>
        </form>
      </div>
    </div>
  );
}