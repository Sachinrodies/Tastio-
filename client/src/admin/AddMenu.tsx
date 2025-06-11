import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EditIcon, Loader2, PlusIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import MenuImage from "@/assets/menu2.jpg"
import EditMenu from './EditMenu'
import type { MenuSchemaType } from '@/schema/MenuSchema'
import { MenuSchema } from '@/schema/MenuSchema'
import { ZodError } from 'zod'
import { userMenuStore } from '@/store/useMenuStore'
import { toast } from 'sonner'
import { useRestaurantStore } from '@/store/useRestaurantStore'

type MenuWithId = MenuSchemaType & { _id: string };

const MenuData = [
    {
        id: 1,
        name: "Biryani",
        description: "Biryani is a delicious dish that is made with rice and meat.",
        price: 80,
        image: MenuImage
    },
    {
        id: 2,
        name: "Biryani",
        description: "Biryani is a delicious dish that is made with rice and meat.",
        price: 80,
        image: MenuImage
    },
    {
        id: 3,
        name: "Biryani",
        description: "Biryani is a delicious dish that is made with rice and meat.",
        price: 80,
        image: MenuImage
    }
]

const AddMenu = () => {
    const [input, setInput] = useState<MenuSchemaType>({
        name: "",
        description: "",
        price: 0,
        image: null as unknown as File
    })
    const [error, setError] = useState<ZodError | null>(null);
    const [open, setOpen] = useState<boolean>(false)
    const [editMenu, setEditMenu] = useState<boolean>(false)
    const [selectedMenu, setSelectedMenu] = useState<MenuWithId | null>(null)
    const {loading, createMenu} = userMenuStore();
    const {restaurant} = useRestaurantStore();

    // Reset form and loading state when dialog opens/closes
    useEffect(() => {
        if (!open) {
            setInput({
                name: "",
                description: "",
                price: 0,
                image: null as unknown as File
            });
            setError(null);
        }
    }, [open]);

    // Reset loading state when dialog opens
    useEffect(() => {
        if (open) {
            userMenuStore.setState({ loading: false });
        }
    }, [open]);

    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "price") {
            setInput({ ...input, [name]: Number(value) });
        } else {
            setInput({ ...input, [name]: value });
        }
    };

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = MenuSchema.safeParse(input);
        if (!result.success) {
            setError(result.error);
        } else {
            try {
                const formData = new FormData();
                formData.append('name', result.data.name);
                formData.append('description', result.data.description);
                formData.append('price', result.data.price.toString());
                if (result.data.image) {
                    formData.append('image', result.data.image);
                }
                await createMenu(formData);
                setOpen(false);
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Menu creation failed');
            }
        }
    }

    return (
        <div className="max-w-6xl mx-auto my-10">
            <div className="flex justify-between">
                <h1 className="font-bold md:font-extrabold md:text-2xl text-lg">
                    Available Menu
                </h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#D19254] text-white hover:bg-[#D19254]/80">
                            <PlusIcon className="mr-1" />
                            Add Menu
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add  Menu</DialogTitle>
                            <DialogDescription>
                                Create a Menu that will stand out your restaurant.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitHandler}>
                            <div className="mb-4">
                                <Label className="mb-2 block">Name</Label>
                                <Input type="text" value={input.name} onChange={changeEventHandler} name="name" placeholder="Enter Menu Name" />
                                {error?.formErrors.fieldErrors.name && (
                                    <span className="text-red-500">
                                        {error.formErrors.fieldErrors.name[0]}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <Label className="mb-2 block">Description</Label>
                                <Input type="text" value={input.description} onChange={changeEventHandler} name="description" placeholder="Enter Menu Description" />
                                {error?.formErrors.fieldErrors.description && (
                                    <span className="text-red-500">
                                        {error.formErrors.fieldErrors.description[0]}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <Label className="mb-2 block">Price in (₹)</Label>
                                <Input type="text" value={input.price} onChange={changeEventHandler} name="price" placeholder="Enter Menu Price" />
                                {error?.formErrors.fieldErrors.price && (
                                    <span className="text-red-500">
                                        {error.formErrors.fieldErrors.price[0]}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <Label className="mb-2 block">Upload Menu Image</Label>
                                <Input
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setInput({ ...input, image: file });
                                            setError(null);
                                        }
                                    }}
                                    name="image"
                                    accept="image/*"
                                    placeholder="Enter Menu Image"
                                />
                                {error?.formErrors.fieldErrors.image && (
                                    <span className="text-red-500">
                                        {error.formErrors.fieldErrors.image[0]}
                                    </span>
                                )}
                            </div>
                            <DialogFooter className="mt-5">
                                <Button 
                                    className="bg-[#D19254] text-white hover:bg-[#D19254]/80" 
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        'Add Menu'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            {restaurant && restaurant.menus &&
              restaurant.menus
                .filter((item: any) => item && item._id && item.name && item.price && item.imageUrl)
                .map((item: any, idx: number) => (
                  <div className="mt-6 space-y-4" key={item._id}>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md rounded-lg border">
                      <div className="w-full md:w-64 flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt="Menu"
                          className="w-full h-[200px] md:h-[250px] object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 flex flex-col mt-4 md:mt-0">
                        <h1 className="text-lg font-semibold text-gray-800 ">{item.name}</h1>
                        <p>{item.description}</p>
                        <h2 className="text-md font-semibold mt-2">
                          Price:<span className="text-[#D19254]">₹{item.price}</span>
                        </h2>
                        <div className="mt-4 flex justify-center">
                          <Button
                            onClick={() => {
                              setSelectedMenu({
                                _id: item._id,
                                name: item.name,
                                description: item.description,
                                price: item.price,
                                image: item.imageUrl
                              });
                              setEditMenu(true);
                            }}
                            className="bg-[#D19254] text-white hover:bg-[#D19254]/80 px-6 py-2 w-full max-w-xs rounded-md text-sm flex items-center justify-center"
                          >
                            <EditIcon className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            }

            <EditMenu 
                selectedMenu={selectedMenu} 
                setSelectedMenu={setSelectedMenu}
                editMenu={editMenu} 
                setEditMenu={setEditMenu} 
            />
        </div>
    )
}

export default AddMenu