import express from "express";
import { healthCheck } from "../controllers/healthCheck.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Health Check
 *   description: API status monitoring
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check API health/status
 *     tags: [Health Check]
 *     responses:
 *       200:
 *         description: Server is up and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API is healthy
 */
router.get("/", healthCheck);

export default router;
