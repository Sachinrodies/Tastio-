import { Minus, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Button } from "./button"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./table"
import { useState } from "react"
import CheckoutConfirmPage from "./CheckoutConfirmPage"
import { useCartStore } from "@/store/useCartStore"
import type { cartItem } from "@/types/CartType"
import { toast } from "sonner"

const Cart = () => {
    const [open, setOpen] = useState<boolean>(false)
    const {cartItems,clearCart,removeFromCart,incrementQuantity,decrementQuantity}=useCartStore()

    const handleProceedToCheckout = () => {
        if (!cartItems.length) {
            toast.error("Your cart is empty. Please add items to proceed.");
            return;
        }

        const restaurantId = cartItems[0]?.restaurantId;
        if (!restaurantId) {
            toast.error("Restaurant ID is missing. Please try adding items to cart again.");
            return;
        }

        setOpen(true);
    }

    return (
        <div className="flex mx-auto my-10 flex-col max-w-7xl">
            <div className="flex justify-end">
                <Button onClick={clearCart} variant="link">Clear All</Button>
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
                        {
                            cartItems.map((item:cartItem)=>(
                                <TableRow key={item._id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Avatar>
                                        <AvatarImage src={item.image} alt="" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <span>{item.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>₹{item.price}</TableCell>
                            <TableCell>
                                <div className="flex items-center w-fit shadow-md rounded-full border border-gray-100 dark:border-gray-800">
                                    <Button onClick={()=>decrementQuantity(item._id)} size="icon" variant="outline" className="rounded-full bg-gray-200">
                                        <Minus />
                                    </Button>
                                    <Button disabled variant="outline" size="icon" className="font-bold border-none">
                                        {item.quantity}
                                    </Button>
                                    <Button onClick={()=>incrementQuantity(item._id)} size="icon" variant="outline" className="rounded-full bg-[#D19254] hover:bg-[#D19254]/80">
                                        <Plus />
                                    </Button>
                                </div>
                            </TableCell>
                                <TableCell>₹{item.price*item.quantity}</TableCell>
                            <TableCell className="text-right">
                                <Button onClick={()=>removeFromCart(item._id)} size="sm" variant="link" className="bg-[#D19254] text-white hover:bg-[#D19254]/80">
                                    Remove
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4} className="text-left">Total</TableCell>
                            <TableCell className="text-right">₹{cartItems.reduce((acc,item)=>acc+item.price*item.quantity,0)}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
                <div className="flex justify-end my-5 ">
                    <Button onClick={handleProceedToCheckout} size={'lg'} className="bg-[#D19254] text-white hover:bg-[#D19254]/80"> Proceed to Checkout</Button>
                </div>
                <CheckoutConfirmPage open={open} setOpen={setOpen} restaurantId={cartItems[0]?.restaurantId || ''} />
            </div>
        </div>
    )
}

export default Cart