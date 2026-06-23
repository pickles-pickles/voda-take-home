import type { Request, Response } from "express";

import * as assetService from "../services/assets.service";

export async function getAssets(
    req: Request,
    res: Response
) {
    try {
        const result = await assetService.getAssets({
            page: Number(req.query.page) || 1,
            pageSize: Number(req.query.pageSize) || 20,

            type: req.query.type as string,
            status: req.query.status as string,

            lat: req.query.lat
                ? Number(req.query.lat)
                : undefined,

            lng: req.query.lng
                ? Number(req.query.lng)
                : undefined,

            radiusKm: req.query.radiusKm
                ? Number(req.query.radiusKm)
                : undefined,
        });

        res.status(200).json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch assets",
        });
    }
}

export async function getAssetById(
    req: Request,
    res: Response
) {
    try {
        const asset = await assetService.getAssetById(
            req.params.id
        );

        if (!asset) {
            return res.status(404).json({
                message: "Asset not found",
            });
        }

        res.status(200).json(asset);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch asset",
        });
    }
}

export async function createAsset(
    req: Request,
    res: Response
) {
    try {
        const asset = await assetService.createAsset(
            req.body
        );

        res.status(201).json(asset);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create asset",
        });
    }
}

export async function updateAsset(
    req: Request,
    res: Response
) {
    try {
        const asset =
            await assetService.updateAsset(
                req.params.id,
                req.body
            );

        if (!asset) {
            return res.status(404).json({
                message: "Asset not found",
            });
        }

        res.status(200).json(asset);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update asset",
        });
    }
}

export async function deleteAsset(
    req: Request,
    res: Response
) {
    try {
        const asset =
            await assetService.deleteAsset(
                req.params.id
            );

        if (!asset) {
            return res.status(404).json({
                message: "Asset not found",
            });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete asset",
        });
    }
}