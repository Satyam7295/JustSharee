import { Router } from "express";
import { getQRCode } from "../controllers/qr.controller.js";

const router = Router();

// GET /api/qr?data=<value>
router.get("/", getQRCode);

export default router;
