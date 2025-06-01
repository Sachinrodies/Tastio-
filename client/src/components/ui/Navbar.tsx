import { HandPlatter, Menu, PackageCheck, SquareMenu, User, UtensilsCrossed } from "lucide-react";
import { Button } from "./button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./sheet"
import { Loader2, LogIn, LogOut, ShoppingCart, Sun } from "lucide-react";
import { Link } from "react-router-dom"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "./menubar";
import { Moon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Label } from "./label"
import { Input } from "./input"
import { Separator } from "./separator"

const Navbar = () => {
  const admin = true;
  const loading = false;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between h-16">
        <Link to="/navbar">
          <h1 className="md:font-extrabold text-2xl font-bold">Tastio</h1>
        </Link>
        <div className="hidden md:flex items-center gap-10">
          <div className="hidden md:flex items-center gap-6">
            <Link to="/">Home</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/orders/status">Orders</Link>


            {
              admin && (
                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger>
                      Dashboard
                    </MenubarTrigger>
                    <MenubarContent>
                      <Link to="/admin/restaurants">
                        <MenubarItem>Restaurant</MenubarItem>
                      </Link>

                      <Link to="/admin/menu">
                        <MenubarItem>Menu</MenubarItem>
                      </Link>
                      <Link to="/admin/orders">
                        <MenubarItem>Orders</MenubarItem>
                      </Link>

                    </MenubarContent>

                  </MenubarMenu>


                </Menubar>

              )
            }




          </div>
          <div className="flex items-center gap-4">
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Dark
                  </DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>

            </div>
            <Link to="/cart" className="relative cursor-pointer">
              <ShoppingCart />
              <Button size="icon" className="absolute -inset-y-3 left-2 text-xs rounded-full h-4 w-4 bg-red-500 hover:bg-red-600 text-white">1</Button>

            </Link>
            <div>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

            </div>
            <div>
              {
                loading ? <Button disabled={true} className="bg-[#D19254] hover:bg-[#d18c47]">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button> : <Button className="bg-[#D19254] hover:bg-[#d18c47]">
                  Logout
                </Button>
              }
            </div>

          </div>
        </div>
        <div className="md:hidden lg:hidden">
          {/* Mobile responsive */}
          <MobileNavbar />

        </div>

      </div>


    </div>
  )
}

export default Navbar
const MobileNavbar = () => {
  const user = true;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full bg bg-gray-200 text-black hover:bg-gray-200">
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col ">
        <SheetHeader className="flex flex-row  items-center justify-between mt-2">
          <SheetTitle>Tastio</SheetTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem>
                Dark
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>

        </SheetHeader>
        <Separator className="my-2" />
        <SheetDescription className="flex-1">
          <Link to="/profile" className="flex items-center gap-4 hover:bg-gray-200  px-2 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium ">
            <User />
            <span>Profile</span>

          </Link>
          <Link to="/profile" className="flex items-center gap-4 hover:bg-gray-200  px-2 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium ">
            <HandPlatter />
            <span>Orders</span>

          </Link>
          <Link to="/profile" className="flex items-center gap-4 hover:bg-gray-200  px-2 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium ">
            <ShoppingCart />
            <span>Cart(1)</span>

          </Link>
          <Link to="/profile" className="flex items-center gap-4 hover:bg-gray-200  px-2 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium ">
            <SquareMenu/>
            <span>Menu</span>

          </Link>
          <Link to="/profile" className="flex items-center gap-4 hover:bg-gray-200  px-2 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium ">
            <UtensilsCrossed />
            <span>Restaurant</span>

          </Link>
          <Link to="/profile" className="flex items-center gap-4 hover:bg-gray-200  px-2 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium ">
            <PackageCheck/>
            <span>Restaurant Orders</span>

          </Link>
         

        </SheetDescription>


        <SheetFooter className="flex flex-col gap-4">
          
            
              <>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className="font-bold ">Tastio</h1>
               
              </div>
              </>
           
            <>
            <Button type="submit" className="bg-[#D19254] hover:bg-[#d18c47]">Login</Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
            </>
          

        
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )


}
