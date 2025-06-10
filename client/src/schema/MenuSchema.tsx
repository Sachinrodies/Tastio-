import { z } from "zod";

export const MenuSchema = z.object({
    name: z.string().nonempty({message:"Name is required"}),
    description: z.string().nonempty({message:"Description is required"}),
    price: z.number().min(0,{message:"Price cannot be negative"}),
    image: z.union([
        z.instanceof(File).refine(
            (file) => file && file.size <= 1024 * 1024 * 5,
            { message: "Image file must be less than 5MB" }
        ),
        z.string()
    ])
})
export type MenuSchemaType = z.infer<typeof MenuSchema>;