import type { Dispatch, SetStateAction } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog"
import { Label } from "./label"
import { Input } from "./input"
import { useState } from "react"
import { Button } from "./button"


const CheckoutConfirmPage = ({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contact: "",

    address: "",
    city: "",
    country: "",

  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(formData)
   
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold">Review Your Order</DialogTitle>
          <DialogDescription className="text-xs">
            Double check your order before placing it.When you are ready, click the button below to complete your order.
          </DialogDescription>
          <form onSubmit={handleSubmit} className="md:grid grid-cols-2 gap-2 space-y-1 md:space-y-0">
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
              <Input onChange={handleChange} type="email" name="email" value={formData.email} />

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
            <DialogFooter className="col-span-2 pt-5">
              <Button className="bg-[#D19254] text-white hover:bg-[#D19254]/80">Continue to Payment</Button>
            </DialogFooter>


          </form>
        </DialogHeader>
      </DialogContent>

    </Dialog>

  )
}

export default CheckoutConfirmPage