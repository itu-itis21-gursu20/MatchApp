import React from 'react';
import { Card } from 'flowbite-react';
import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

const Features = () => {
  return (
<>

    <div className='flex md:flex-row flex-col mt-5 items-center'>
        <Card
          imgAlt="Meaningful alt text for an image that is not purely decorative"
          imgSrc="/images/blog/image-1.jpg"
          className='md:w-1/3 md:mr-5 mt-2'
          >
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            <p>
              Noteworthy technology acquisitions 2021
            </p>
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            <p>
              Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
            </p>
          </p>
        </Card>
        <Card
          imgAlt="Meaningful alt text for an image that is not purely decorative"
          imgSrc="/images/blog/image-1.jpg"
          className='md:w-1/3 md:mr-5 mt-2'
          >
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            <p>
              Noteworthy technology acquisitions 2021
            </p>
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            <p>
              Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
            </p>
          </p>
        </Card>
        <Card
          imgAlt="Meaningful alt text for an image that is not purely decorative"
          imgSrc="/images/blog/image-1.jpg"
          className='md:w-1/3 md:mr-5 mt-2'
          >
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            <p>
              Noteworthy technology acquisitions 2021
            </p>
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            <p>
              Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
            </p>
          </p>
        </Card>
    </div>
    <div className='flex justify-center items-center mt-3'>
        <Link to="/duel">
            <Button >PLAY DUEL GAME</Button>
        </Link>
    </div>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    </>
)
}

export default Features;