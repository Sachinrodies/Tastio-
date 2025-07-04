import { Router } from "express";
import upload from "../Middlewares/multer";
import { isAuthenticated } from "../Middlewares/isAuthenticated";
import { createRestaurant, getRestaurant, updateRestaurant, getRestaurantOrMenu, updateOrderStatus, searchRestaurant, getSingleRestaurant, getRestaurantOrders } from "../Controller/restaurant.controller";
const router=Router();
router.route("/").post(isAuthenticated,upload.single("image"),createRestaurant);
router.route("/").get(isAuthenticated,getRestaurantOrMenu);
router.route("/").put(isAuthenticated,upload.single("image"),updateRestaurant);
router.route("/order/status/:orderId").put(isAuthenticated,updateOrderStatus);
router.route("/order/:id").get(isAuthenticated, getRestaurantOrders);
router.route("/search/:searchText").get(isAuthenticated,searchRestaurant);
router.route("/:restaurantId").get(isAuthenticated,getSingleRestaurant);
export default router;

