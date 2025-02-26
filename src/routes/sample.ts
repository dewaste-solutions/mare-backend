import express from "express";

import { createSample, deleteSample, getSample, getSampleById } from "../controller";
import { validateSample, validateSampleId } from "../helper";

export const sampleRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sample
 *   description: Sample management API
 */

/**
 * @swagger
 * /api/sample:
 *   get:
 *     summary: Get all sample
 *     tags: [Sample]
 *     responses:
 *       200:
 *         description: List of all sample
 */
sampleRoutes.get("/", getSample);

/**
 * @swagger
 * /api/sample/{id}:
 *   get:
 *     summary: Get a sample by ID
 *     tags: [Sample]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Sample ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sample found
 *       404:
 *         description: Sample not found
 */
sampleRoutes.get("/:id", validateSampleId, getSampleById);

/**
 * @swagger
 * /api/sample:
 *   post:
 *     summary: Create a new sample
 *     tags: [Sample]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *     responses:
 *       201:
 *         description: Sample created successfully
 */
sampleRoutes.post("/", validateSample, createSample);

/**
 * @swagger
 * /api/sample/{id}:
 *   delete:
 *     summary: Delete a sample by ID
 *     tags: [Sample]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Sample ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sample deleted successfully
 *       404:
 *         description: Sample not found
 */
sampleRoutes.delete("/:id", validateSampleId, deleteSample);
