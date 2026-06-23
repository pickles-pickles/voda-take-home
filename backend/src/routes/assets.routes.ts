import { Router } from "express";
import type { Request, Response } from "express";

import {
    getAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset,
} from "../controllers/assets.controller";
import { BASE_URL } from "../helpers/constants";

const router = Router();

router.get(`${BASE_URL}/assets`, getAssets);

router.get(`${BASE_URL}/assets/:id`, getAssetById);

router.post(`${BASE_URL}/assets`, createAsset);

router.put(`${BASE_URL}/assets/:id`, updateAsset);

router.delete(`${BASE_URL}/assets/:id`, deleteAsset);

export default router;