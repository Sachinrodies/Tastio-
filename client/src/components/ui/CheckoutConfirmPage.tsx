import type { Dispatch, SetStateAction } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog"
import { Label } from "./label"
import { Input } from "./input"
import { useState } from "react"
import { Button } from "./button"
import { useUserStore } from "@/store/useUseStore"
import type { CheckoutSessionResponse } from "@/types/OrderType"
import { useCartStore } from "@/store/useCartStore"
import { useOrderStore } from "@/store/UseOrderStore"
import { toast } from "sonner"

const CheckoutConfirmPage = ({ open, setOpen, restaurantId = '' }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, restaurantId?: string }) => {
  const {user}=useUserStore()
  const {cartItems}=useCartStore()
  const {createCheckoutSession,loading}=useOrderStore()
  const [formData, setFormData] = useState({
    fullname: user?.fullname,
    email: user?.email,
    contact: user?.contact,
    address: user?.address,
    city: user?.city,
    country: user?.country,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (!restaurantId) {
        toast.error("Restaurant ID is required. Please try adding items to cart again.");
        setOpen(false);
        return;
      }

      const checkoutData:CheckoutSessionResponse={
        cartItems:cartItems.map((item)=>({
          menuId:item._id,
          name:item.name,
          image:item.image,
          price:item.price,
          quantity:item.quantity,
        })),
        deliveryDetails:formData,
        restaurantId:restaurantId,
      }
      createCheckoutSession(checkoutData)
    }
    catch(error){
      toast.error("An error occurred during checkout. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold">Review Your Order</DialogTitle>
          <DialogDescription className="text-xs">
            Double check your order before placing it.When you are ready, click the button below to complete your order.
          </DialogDescription>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 md:p-0 p-2">
            <div >
              <Label>
                Full Name
              </Label>
              <Input onChange={handleChange} type="text" name="fullname" value={formData.fullname} />
            </div>
            <div >
              <Label>
                Email
              </Label>
              <Input disabled onChange={handleChange} type="email" name="email" value={formData.email} />
            </div>
            <div >
              <Label>
                Contact Number
              </Label>
              <Input onChange={handleChange} type="text" name="contact" value={formData.contact} />
            </div>
            <div >
              <Label>
                Address
              </Label>
              <Input onChange={handleChange} type="text" name="address" value={formData.address} />
            </div>
            <div >
              <Label>
                City
              </Label>
              <Input onChange={handleChange} type="text" name="city" value={formData.city} />
            </div>
            <div >
              <Label>
                Country
              </Label>
              <Input onChange={handleChange} type="text" name="country" value={formData.country} />
            </div>
            <DialogFooter className="md:col-span-2 pt-5">
              {
                loading ? <Button disabled className="bg-[#D19254] text-white hover:bg-[#D19254]/80">Loading...</Button> : <Button type="submit" className="bg-[#D19254] text-white hover:bg-[#D19254]/80">Continue to Payment</Button>
              }
            </DialogFooter>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CheckoutConfirmPage