
import { useEffect, useState } from "react";
import type { ChangeEvent, } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../store/store";
import { setFilters, resetFilters } from "../store/filtersSlice";
/* import { setAssets, setPagination } from "../store/assetsSlice"; */

import { getAssets } from "../services/assets";
import { paginationSelector } from "../store/assetsSlice";

type Errors = {
    lat?: string;
    lng?: string;
    radiusKm?: string;
};

type LocalFilters = {
    type: string;
    status: string;
    lat: string;
    lng: string;
    radiusKm: string;
};




export default function Filters() {
    const dispatch = useDispatch();
    const pagination = useSelector(paginationSelector)

    const filters = useSelector(
        (state: RootState) => state.filters
    );

    const [searchParams, setSearchParams] =
        useSearchParams();

    const [local, setLocal] =
        useState<LocalFilters>({
            type: "",
            status: "",
            lat: "",
            lng: "",
            radiusKm: "",
        });

    const [errors, setErrors] =
        useState<Errors>({});

    const [apiError, setApiError] =
        useState("");

    const [isLoading, setIsLoading] =
        useState(false);

    useEffect(() => {
        const params =
            new URLSearchParams(searchParams);

        let changed = false;

        if (!params.has("page")) {
            params.set(
                "page",
                String(pagination.page)
            );

            changed = true;
        }

        if (!params.has("pageSize")) {
            params.set(
                "pageSize",
                String(pagination.pageSize)
            );

            changed = true;
        }

        if (changed) {
            setSearchParams(params, {
                replace: true,
            });
        }

        setLocal({
            type:
                searchParams.get("type") ?? "",
            status:
                searchParams.get("status") ?? "",
            lat:
                searchParams.get("lat") ?? "",
            lng:
                searchParams.get("lng") ?? "",
            radiusKm:
                searchParams.get("radiusKm") ??
                "",
        });
    }, []);

    function handleChange(
        e:
            | ChangeEvent<HTMLInputElement>
            | ChangeEvent<HTMLSelectElement>
    ) {
        const { name, value } = e.target;

        setLocal((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function validate() {
        const nextErrors: Errors = {};

        const hasLat = local.lat.trim() !== "";
        const hasLng = local.lng.trim() !== "";
        const hasRadius =
            local.radiusKm.trim() !== "";

        const geoFilterUsed =
            hasLat || hasLng || hasRadius;

        if (geoFilterUsed) {
            if (!hasLat) {
                nextErrors.lat =
                    "Latitude is required";
            }

            if (!hasLng) {
                nextErrors.lng =
                    "Longitude is required";
            }

            if (!hasRadius) {
                nextErrors.radiusKm =
                    "Radius is required";
            }
        }

        if (hasLat) {
            const lat =
                Number(local.lat);

            if (
                Number.isNaN(lat) ||
                lat < -90 ||
                lat > 90
            ) {
                nextErrors.lat =
                    "Latitude must be between -90 and 90";
            }
        }

        if (hasLng) {
            const lng =
                Number(local.lng);

            if (
                Number.isNaN(lng) ||
                lng < -180 ||
                lng > 180
            ) {
                nextErrors.lng =
                    "Longitude must be between -180 and 180";
            }
        }

        if (hasRadius) {
            const radius =
                Number(local.radiusKm);

            if (
                Number.isNaN(radius) ||
                radius <= 0
            ) {
                nextErrors.radiusKm =
                    "Radius must be greater than 0";
            }
        }

        setErrors(nextErrors);

        return (
            Object.keys(nextErrors).length ===
            0
        );
    }

    async function handleApply() {
        setApiError("");

        const valid = validate();

        if (!valid) {
            return;
        }

        const params =
            new URLSearchParams();

        console.log({ params });


        params.set(
            "page",
            String(pagination.page)
        );

        params.set(
            "pageSize",
            String(pagination.pageSize)
        );

        if (local.type) {
            params.set("type", local.type);
        }

        if (local.status) {
            params.set(
                "status",
                local.status
            );
        }

        if (local.lat) {
            params.set("lat", local.lat);
        }

        if (local.lng) {
            params.set("lng", local.lng);
        }

        if (local.radiusKm) {
            params.set(
                "radiusKm",
                local.radiusKm
            );
        }

        const payload = {
            type: local.type,
            status: local.status,
            lat: local.lat
                ? Number(local.lat)
                : undefined,
            lng: local.lng
                ? Number(local.lng)
                : undefined,
            radiusKm: local.radiusKm
                ? Number(local.radiusKm)
                : undefined,
        };

        try {
            setIsLoading(true);

            setSearchParams(params);

            dispatch(
                setFilters(payload)
            );

            /*  const response =
                 await getAssets({
                     page: pagination.page,
                     pageSize:
                         pagination.pageSize,
                     ...payload,
                 }); */

            /*       dispatch(
                    setAssets(response.data)
                  );
            
                  dispatch(
                    setPagination(
                      response.pagination
                    ) 
                  );*/
        } catch (error) {
            console.error(error);

            setApiError(
                "Failed to load assets."
            );
        } finally {
            setIsLoading(false);
        }
    }

    function handleReset() {
        setErrors({});
        setApiError("");

        const params =
            new URLSearchParams();

        params.set(
            "page",
            String(pagination.page)
        );

        params.set(
            "pageSize",
            String(pagination.pageSize)
        );

        setSearchParams(params);

        setLocal({
            type: "",
            status: "",
            lat: "",
            lng: "",
            radiusKm: "",
        });

        dispatch(resetFilters());
    }

    return (
        <div className="card p-3 mb-3">
            <h5 className="mb-3">
                Filters
            </h5>

            {apiError && (
                <div className="alert alert-danger">
                    {apiError}
                </div>
            )}

            <div className="row g-3">
                <div className="col-md-3">
                    <label className="form-label">
                        Type
                    </label>

                    <select
                        className="form-select"
                        name="type"
                        value={local.type}
                        onChange={handleChange}
                    >
                        <option value="">
                            All
                        </option>

                        <option value="pipe">
                            Pipe
                        </option>

                        <option value="hydrant">
                            Hydrant
                        </option>

                        <option value="sensor">
                            Sensor
                        </option>

                        <option value="valve">
                            Valve
                        </option>
                    </select>
                </div>

                <div className="col-md-3">
                    <label className="form-label">
                        Status
                    </label>

                    <select
                        className="form-select"
                        name="status"
                        value={local.status}
                        onChange={handleChange}
                    >
                        <option value="">
                            All
                        </option>

                        <option value="ok">
                            OK
                        </option>

                        <option value="warning">
                            Warning
                        </option>

                        <option value="critical">
                            Critical
                        </option>
                    </select>
                </div>

                <div className="col-md-2">
                    <label className="form-label">
                        Latitude
                    </label>

                    <input
                        type="text"
                        name="lat"
                        value={local.lat}
                        onChange={handleChange}
                        className={`form-control ${errors.lat
                            ? "is-invalid"
                            : ""
                            }`}
                    />

                    {errors.lat && (
                        <div className="invalid-feedback">
                            {errors.lat}
                        </div>
                    )}
                </div>

                <div className="col-md-2">
                    <label className="form-label">
                        Longitude
                    </label>

                    <input
                        type="text"
                        name="lng"
                        value={local.lng}
                        onChange={handleChange}
                        className={`form-control ${errors.lng
                            ? "is-invalid"
                            : ""
                            }`}
                    />

                    {errors.lng && (
                        <div className="invalid-feedback">
                            {errors.lng}
                        </div>
                    )}
                </div>

                <div className="col-md-2">
                    <label className="form-label">
                        Radius (km)
                    </label>

                    <input
                        type="text"
                        name="radiusKm"
                        value={local.radiusKm}
                        onChange={handleChange}
                        className={`form-control ${errors.radiusKm
                            ? "is-invalid"
                            : ""
                            }`}
                    />

                    {errors.radiusKm && (
                        <div className="invalid-feedback">
                            {errors.radiusKm}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-3 d-flex gap-2">
                <button
                    type="button"
                    className="btn btn-primary"
                    disabled={isLoading}
                    onClick={handleApply}
                >
                    {isLoading
                        ? "Loading..."
                        : "Apply Filters"}
                </button>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleReset}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
