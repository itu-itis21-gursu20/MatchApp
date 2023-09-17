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
import { userRequest } from "../requestMethods";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import Photos from "../components/Photos/Photos";
import Users from "../components/Users";
   
  const TABS = [
    {
        label: "Users",
        value: "Users",
    },
    {
        label: "Photos",
        value: "Photos",
    },
  ];
   
  const TABLE_HEAD = ["Photo", "Photo Owner", "Title", "Description", "Point"];
   
  export function Leaderboard() {

    const { imagesList, userList, sortOrder, setSortOrder, activeTab, setActiveTab, currentPage, setCurrentPage} = useContext(ChatContext);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSortToggle = () => {
        setSortOrder(prevSort => prevSort === 'asc' ? 'desc' : 'asc');
    };

    const handleNext = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };
    
    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };
    
    return (
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                LEADERBOARD
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all users and photos
              </Typography>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Tabs value="all" className="w-full md:w-max">
              <TabsHeader>
                {TABS.map(({ label, value }) => (
                  <Tab 
                    key={value} 
                    value={value} 
                    onClick={() => setActiveTab(value)} 
                    style={activeTab === value ? {textDecoration: 'underline'} : {}}
                  >
                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
            <div className="w-full md:w-72">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        {activeTab === 'Photos' && <Photos imagesList={imagesList} handleSortToggle={handleSortToggle} sortOrder={sortOrder} />}
        {activeTab === 'Users' && <Users userList={userList} handleSortToggle={handleSortToggle} sortOrder={sortOrder} searchTerm={searchTerm}/>}

        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page 1 of 10
          </Typography>
          <div className="flex gap-2">
          <Button variant="outlined" size="sm" onClick={handlePrev}>
            Previous
          </Button>
          <Button variant="outlined" size="sm" onClick={handleNext}>
              Next
          </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }