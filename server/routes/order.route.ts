import { Router } from "express";
import { createCheckoutSession, getOrders } from "../Controller/order.controller";
import { isAuthenticated } from "../Middlewares/isAuthenticated";
const router=Router();
router.route("/").get(isAuthenticated,getOrders);
router.route("/checkout/create-checkout-session").post(isAuthenticated,createCheckoutSession);
export default router;