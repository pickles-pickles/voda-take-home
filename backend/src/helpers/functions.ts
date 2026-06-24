import { Request } from "express"

export const generateSafeId = (value: string | string[]) => {
    const safeId = Array.isArray(value) ? value[0] : value;

    if (!safeId) {
        throw new Error("Missing id");
    }
    return safeId
}