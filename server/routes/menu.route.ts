import { Router } from "express";
import upload from "../Middlewares/multer";
import { isAuthenticated } from "../Middlewares/isAuthenticated";
import { addMenu, editMenu } from "../Controller/menu.controller";

const router=Router();
router.route("/").post(isAuthenticated,upload.single("image"),addMenu);
router.route("/:id").put(isAuthenticated,upload.single("image"),editMenu);

export default router;

