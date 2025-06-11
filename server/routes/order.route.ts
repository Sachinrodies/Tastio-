import { Router } from "express";
import { createCheckoutSession, getOrders, getOrderStatus, stripeWebhook } from "../Controller/order.controller";
import { isAuthenticated } from "../Middlewares/isAuthenticated";
import express from "express";

const router=Router();
router.route("/").get(isAuthenticated,getOrders);
router.route("/checkout/create-checkout-session").post(isAuthenticated,createCheckoutSession);
router.route("/webhook").post(express.raw({type:"application/json"}),stripeWebhook);
export default router;