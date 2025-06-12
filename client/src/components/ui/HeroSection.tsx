import { useState } from 'react'
import { Input } from './input'
import { Search } from 'lucide-react'
import { Button } from './button'
import HeroImage from '@/assets/hero_pizza.png'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const HeroSection = () => {
    const [search, setSearch] = useState<string>("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (!search.trim()) {
            toast.error('Please enter a search term');
            return;
        }
        navigate(`/search/${search.trim()}`);
    };

    return (
        <div className=" flex  flex-col md:flex-row  max-w-7xl mx-auto md:p-10 rounded-lg items-center justify-center m-4 gap-20">
            <div className="flex flex-col gap-10 md:w[40%]">
                <div className="flex  flex-col gap-5">
                    <h1 className="font-bold md:font-extrabold md:text-5xl text-4xl">Order Food anytime & anywhere</h1>
                    <p className=" text-gray-500">Hey! Our Delicious Food is waiting for you.</p>

                </div>
                <div className="relative flex items-center gap-2 ">

                    <Input 
                        type="text" 
                        value={search} 
                        placeholder="search restaurant by name,city & country" 
                        onChange={(e) => setSearch(e.target.value)} 
                        className="pl-10 shadow-lg"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                    <Search className="absolute inset-y-2 left-2 md:left-4 text-gray-600 pointer-events-none" />
                    <Button onClick={handleSearch} className="bg-[#D19254] hover:bg-[#d18c47]">Search</Button>

                </div>

            </div>
            <div className="md:w-[60%]">
                <img src={HeroImage} alt="hero" className="w-full  max-h-[500px] h-full object-cover" />
            </div>
        </div>

    )
}

export default HeroSection