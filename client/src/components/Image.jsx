import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useLocation } from 'react-router-dom';

const Image = ({ image }) => {

  return (
    
<div className="flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <img className="rounded-t-lg w-full h-150 object-cover" src={image.imgUrl} alt="" />
      <div className='flex flex-col'>
        <div>{image.desc}</div>
        <div>{image.point}</div>
      </div>
</div>

  )
}

export default Image;