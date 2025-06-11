import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import type { MenuSchemaType } from '@/schema/MenuSchema';
import { MenuSchema } from '@/schema/MenuSchema';
import { userMenuStore } from '@/store/useMenuStore';
import { toast } from 'sonner';

type EditMenuProps = {
  selectedMenu: MenuSchemaType & { _id: string } | null;
  setSelectedMenu: React.Dispatch<React.SetStateAction<MenuSchemaType & { _id: string } | null>>;
  editMenu: boolean;
  setEditMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditMenu = ({ selectedMenu, setSelectedMenu, editMenu, setEditMenu }: EditMenuProps) => {
  const [error, setError] = useState<Partial<MenuSchemaType> | null>(null);
  const { loading, editMenu: editMenuStore } = userMenuStore();

  const [input, setInput] = useState<MenuSchemaType>({
    name: "",
    description: "",
    price: 0,
    image: ""
  });

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "price") {
      setInput({ ...input, [name]: Number(value) || 0 });
    } else {
      setInput({ ...input, [name]: value });
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = MenuSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setError(fieldErrors as Partial<MenuSchemaType>);
    } else {
      try {
        const formData = new FormData();
        formData.append('name', result.data.name);
        formData.append('description', result.data.description);
        formData.append('price', result.data.price.toString());
        if (result.data.image instanceof File) {
          formData.append('image', result.data.image);
        }
        if (selectedMenu?._id) {
          await editMenuStore(selectedMenu._id, formData);
          setEditMenu(false);
          setSelectedMenu(null);
        }
      } catch (error: any) {
        
        toast.error(error.response?.data?.message || 'Menu update failed');
      }
    }
  };

  useEffect(() => {
    if (selectedMenu) {
      setInput({
        name: selectedMenu.name,
        description: selectedMenu.description,
        price: selectedMenu.price,
        image: selectedMenu.image
      });
    }
  }, [selectedMenu]);

  return (
    <Dialog open={editMenu} onOpenChange={setEditMenu}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Menu</DialogTitle>
          <DialogDescription>
            Edit the menu details to update the menu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <Label className="mb-2 block">Name</Label>
            <Input type="text" value={input.name} onChange={changeEventHandler} name="name" placeholder="Enter Menu Name" />
            {error?.name && <span className="text-red-500">{error.name}</span>}
          </div>
          <div className="mb-4">
            <Label className="mb-2 block">Description</Label>
            <Input type="text" value={input.description} onChange={changeEventHandler} name="description" placeholder="Enter Menu Description" />
            {error?.description && <span className="text-red-500">{error.description}</span>}
          </div>
          <div className="mb-4">
            <Label className="mb-2 block">Price in (₹)</Label>
            <Input type="number" value={input.price} onChange={changeEventHandler} name="price" placeholder="Enter Menu Price" />
            {error?.price && <span className="text-red-500">{error.price}</span>}
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
            {error?.image && <span className="text-red-500">{typeof error.image === 'object' ? error.image.name : "Image is required"}</span>}
          </div>
          <DialogFooter className="mt-5">
            {loading ? (
              <Button disabled className="bg-[#D19254] text-white hover:bg-[#D19254]/80" type="submit">
                <Loader2 className="mr-2 animate-spin" />
                Updating...
              </Button>
            ) : (
              <Button className="bg-[#D19254] text-white hover:bg-[#D19254]/80" type="submit">Update Menu</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMenu;