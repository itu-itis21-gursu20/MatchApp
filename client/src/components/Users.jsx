import React from 'react'
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

const Users = ({ userList, handleSortToggle, sortOrder, searchTerm }) => {
    console.log("Users loaded")

    const filteredUsers = userList.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                        User Profile Image
                    </Typography>
                </th>
                <th className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                        Username
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
                        Total Points{" "}
                        {sortOrder === 'desc'
                            ? <ChevronDownIcon strokeWidth={2} className="h-4 w-4" />
                            : <ChevronUpIcon strokeWidth={2} className="h-4 w-4" />
                        }
                    </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(
                (user, index) => {
                  const isLast = index === filteredUsers.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";
   
                  return (
                    <tr key={user._id}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar src={user.profileImg} alt={user.username} size="md" />
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex flex-col">
                            <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                            >
                            {user.username}
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
                            {user.totalPoint}
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

export default Users