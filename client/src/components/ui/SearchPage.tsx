import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import FilterPage from './FilterPage';
import { Input } from './input';
import { Button } from './button';
import { Badge } from './badge';
import { Globe, X } from 'lucide-react';
import { Card, CardContent, CardFooter } from './card';
import { AspectRatio } from './aspect-ratio';
import hero from "@/assets/hero_pizza.png"
import { MapPin } from 'lucide-react';
import { Skeleton } from './skeleton';







const SearchPage = () => {
    const { query } = useParams();
    const [search, setSearch] = useState<string>("");
    return (
        <div className="max-w-7xl mx-auto my-10">
            <div className="flex flex-col md:flex-row justify-between gap-10">
                <FilterPage />
                <div className=" flex-1">
                    {/* Search Input Field */}
                    <div className="flex items-center gap-2">
                        <Input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for restaurants" className="w-full" />
                        <Button className="bg-[#D19254] hover:bg-[#d18c47]">Search</Button>
                    </div>
                    {/* Searched Items */}
                    <div className="flex flex-col md:flex-row gap-3 md:items-center md:gap-2 my-3">
                        <h1 className="text-lg font-medium">(2)Search Results found <span className="text-[#D19254]">{query}</span></h1>
                        <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                            {
                                ["biryani", "momos", "jalebi", "pizza", "north indian", "dessert", "drinks"].map((selectedFilter: string, idx: number) => (
                                    <div key={idx} className="relative inline-flex items-center max-w-full">
                                        <Badge variant="outline" className="text-[#D19254] rounded-md pr-6 hover:cursor-pointer">{selectedFilter}</Badge>
                                        <X size={16} className="absolute right-1 text-[#D19254] hover:cursor-pointer" />
                                    </div>
                                ))

                            }

                        </div>
                    </div>
                    {/* Restaurant Cards */}
                    <div className="grid  md:grid-cols-3 gap-4">
                        {
                            [1,2,3,4,5,6,7,8,9,10].map((item: number, idx: number) => (
                                <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden
                        hover:shadow-2xl transition-shadow duration-300">
                            <div className="relative">
                                <AspectRatio ratio={16 / 6}>
                                <img src={hero} alt="hero" className="w-full h-full object-cover" />
                                </AspectRatio>
                                <div className="absolute top-2 left-2 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 bg:opacity-75">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Featured
                                    </span>
                                </div>
                                


                            </div>
                            <CardContent className="p-4">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    Pizza Hut
                                </h1>
                                <div className="flex items-center gap-1 mt-2 text-gray-600 dark:text-gray-400">
                                    <MapPin size={16} className="text-gray-500" />
                                    <p className="text-sm">
                                        City:{" "}
                                        <span className="font-medium">Delhi</span>
                                    </p>
                                    
                                </div>
                                <div className="flex items-center gap-1 mt-2 text-gray-600 dark:text-gray-400">
                                    <Globe size={16} className="text-gray-500" />
                                    <p className="text-sm">
                                        Country:{" "}
                                        <span className="font-medium">India</span>
                                    </p>
                                    
                                </div>
                                <div className="flex gap-2 mt-4 flex-wrap">
                                    {
                                        ["Pizza", "Italian", "Fast Food", "Dessert"].map((tag: string, idx: number) => (
                                            <Badge key={idx} variant="outline" className="text-gray-600 dark:text-gray-400 rounded-md px-3 py-1 text-sm font-medium">{tag}</Badge>
                                        ))
                                    }


                                </div>
                                
                            </CardContent>
                            <CardFooter className="p-4 border-t border-gray-200 dark:border-gray-700 text-white flex justify-end">
                                <Link to={`/restaurant/${idx}`}>
                                <Button className="py-2 shadow-md transition-colorsduration-300 px-4 rounded-full font-semibold bg-[#D19254] hover:bg-[#d18c47]">View Details</Button>
       
                            </Link>

                        </CardFooter>

                        </Card>


                            ))
                        }
                        

                    </div>



                </div>


            </div>
        </div>
    )
}

export default SearchPage
const SearchPageSkeleton = () => {
    return (
      <>
        {[...Array(3)].map((_, index) => (
          <Card
            key={index}
            className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden"
          >
            <div className="relative">
              <AspectRatio ratio={16 / 6}>
                <Skeleton className="w-full h-full" />
              </AspectRatio>
            </div>
            <CardContent className="p-4">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="mt-2 flex gap-1 items-center text-gray-600 dark:text-gray-400">
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex gap-2 mt-4 flex-wrap">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
            <CardFooter className="p-4  dark:bg-gray-900 flex justify-end">
              <Skeleton className="h-10 w-24 rounded-full" />
            </CardFooter>
          </Card>
        ))}
      </>
    );
  };
  const NoResultFound = ({ searchText }: { searchText: string }) => {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          No results found
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          We couldn't find any results for "{searchText}". <br /> Try searching
          with a different term.
        </p>
        <Link to="/">
          <Button className="mt-4 bg-orange hover:bg-orangeHover">
            Go Back to Home
          </Button>
        </Link>
      </div>
    );
  };