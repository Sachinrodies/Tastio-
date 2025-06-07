import { Router } from "express";
import upload from "../Middlewares/multer";
import { isAuthenticated } from "../Middlewares/isAuthenticated";
import { createRestaurant, getRestaurant, updateRestaurant, getRestaurantOrMenu, updateOrderStatus, searchRestaurant, getSingleRestaurant } from "../Controller/restaurant.controller";
const router=Router();
router.route("/").post(isAuthenticated,upload.single("image"),createRestaurant);
router.route("/").get(isAuthenticated,getRestaurant);
router.route("/").put(isAuthenticated,upload.single("image"),updateRestaurant);
router.route("/").get(isAuthenticated,getRestaurantOrMenu);
router.route("/order/:orderId/status").put(isAuthenticated,updateOrderStatus);
router.route("/search/:searchText").get(isAuthenticated,searchRestaurant);
router.route("/:restaurantId").get(isAuthenticated,getSingleRestaurant);
export default router;

