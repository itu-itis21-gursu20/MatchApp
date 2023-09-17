import React, { useState } from 'react'
import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
    ChevronUpIcon,
    ChevronDownIcon
  } from "@heroicons/react/24/outline";
  import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
  import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Avatar,
    IconButton,
    Tooltip,
  } from "@material-tailwind/react";

  const fullscreenStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 1000, // some high value to ensure it's above everything else
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)' // semi-transparent black background
};


const Photos = ({ imagesList, handleSortToggle, sortOrder}) => {

  const [isBigger, setIsBigger] = useState(false);

  return (
    <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                        Photo
                    </Typography>
                </th>
                <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                        Photo Owner
                    </Typography>
                </th>
                <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                        Title
                    </Typography>
                </th>
                <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                        Description
                    </Typography>
                </th>
                <th
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                    onClick={handleSortToggle}
                >
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                        Point{" "}
                        {sortOrder === 'desc'
                            ? <ChevronDownIcon strokeWidth={2} className="h-4 w-4" />
                            : <ChevronUpIcon strokeWidth={2} className="h-4 w-4" />
                        }
                    </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {imagesList.map(
                (img, index) => {
                  const isLast = index === imagesList.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
   
                  return (
                    <tr key={img._id}>
                      <td className={classes}>
                        <div className="flex items-center gap-3" >
                          <Avatar src={img.imgUrl} alt={img.userId} size='md'/>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                            <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                            >
                            {img.username}
                            </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                            <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                            >
                            {img.title}
                            </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                            <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                            >
                            {img.desc}
                            </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                            <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                            >
                            {img.point}
                            </Typography>
                        </div>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </CardBody>
  )
}

export default Photos