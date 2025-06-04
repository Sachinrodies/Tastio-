import { Minus, Plus, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Button } from "./button"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./table"
import { useState } from "react"
import CheckoutConfirmPage from "./CheckoutConfirmPage"


const Cart = () => {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <div className="flex mx-auto my-10 flex-col max-w-7xl">
            <div className="flex justify-end">
                <Button variant="link">Clear All</Button>
            </div>

            {/* Wrapper to make table scrollable on small screens */}
            <div className="overflow-x-auto w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="text-right">Remove</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar>
                                        <AvatarImage src="" alt="" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <span>Biryani</span>
                                </div>
                            </TableCell>
                            <TableCell>₹80</TableCell>
                            <TableCell>
                                <div className="flex items-center w-fit shadow-md rounded-full border border-gray-100 dark:border-gray-800">
                                    <Button size="icon" variant="outline" className="rounded-full bg-gray-200">
                                        <Minus />
                                    </Button>
                                    <Button disabled variant="outline" size="icon" className="font-bold border-none">
                                        1
                                    </Button>
                                    <Button size="icon" variant="outline" className="rounded-full bg-[#D19254] hover:bg-[#D19254]/80">
                                        <Plus />
                                    </Button>
                                </div>
                            </TableCell>
                            <TableCell>₹80</TableCell>
                            <TableCell className="text-right">
                                <Button size="sm" variant="link" className="bg-[#D19254] text-white hover:bg-[#D19254]/80">
                                    Remove
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4} className="text-left">Total</TableCell>
                            <TableCell className="text-right">₹80</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
                <div className="flex justify-end my-5 ">
                    <Button onClick ={()=>setOpen(true)} size={'lg'} className="bg-[#D19254] text-white hover:bg-[#D19254]/80"> Proceed to Checkout</Button>

                </div>
                <CheckoutConfirmPage open={open} setOpen={setOpen} />
            </div>
        </div>

    )
}

export default Cart