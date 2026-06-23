import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../store/store";

import {
    setAssets,
    setPagination,
    setLoading,
    setError,
} from "../store/assetsSlice";

import { setFilters, type AssetStatus, type AssetType } from "../store/filtersSlice";
import { getAssets, type AssetQueryParams } from "../services/assets";

import Pagination from "../components/Pagination";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

export default function Assets() {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    /*   const filters = useSelector(
        (state: RootState) => state.filters
      ); */

    const { items, pagination, loading, error } =
        useSelector(
            (state: RootState) => state.assets
        );

    /**
     * 1. Parse URL → normalized query object
     */
    const queryFromUrl = useMemo(() => {
        return {
            page: Number(
                searchParams.get("page") ??
                DEFAULT_PAGE
            ),

            pageSize: Number(
                searchParams.get("pageSize") ??
                DEFAULT_PAGE_SIZE
            ),

            type:
                searchParams.get("type") ?? undefined,

            status:
                searchParams.get("status") ?? undefined,

            lat: searchParams.get("lat")
                ? Number(searchParams.get("lat"))
                : undefined,

            lng: searchParams.get("lng")
                ? Number(searchParams.get("lng"))
                : undefined,

            radiusKm: searchParams.get("radiusKm")
                ? Number(
                    searchParams.get("radiusKm")
                )
                : undefined,
        };
    }, [searchParams]);

    /**
     * 2. Fetch function (single source of truth)
     */


    /**
     * 3. URL is now the trigger (single responsibility)
     */
    useEffect(() => {
        async function fetchAssets(query: AssetQueryParams) {
            try {
                console.log({ query });

                dispatch(setLoading(true));
                dispatch(setError(null));

                const response = await getAssets(query);
                console.log({ response, query });

                dispatch(setAssets(response.data));
                dispatch(
                    setPagination(response.pagination)
                );

                dispatch(
                    setFilters({
                        type: query.type as AssetType,
                        status: query.status as AssetStatus,
                        lat: query.lat,
                        lng: query.lng,
                        radiusKm: query.radiusKm,
                    })
                );
            } catch (err) {
                dispatch(
                    setError("Failed to load assets")
                );
                console.warn(err);

            } finally {
                dispatch(setLoading(false));
            }
        }
        fetchAssets(queryFromUrl);
    }, [queryFromUrl, dispatch]);

    /**
     * 4. Pagination change → updates URL only
     */
    function handlePageChange(page: number) {
        const params = new URLSearchParams(
            searchParams
        );

        params.set("page", String(page));

        window.history.replaceState(
            null,
            "",
            `?${params.toString()}`
        );

        // IMPORTANT:
        // This triggers useEffect via searchParams change
    }

    if (loading) {
        return (
            <div className="text-center mt-4">
                Loading assets...
            </div>
        );
    }

    return (
        <div className="mt-3">
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="list-group">
                {items.map((asset) => (
                    <div key={asset.id} className="list-group-item py-3">

                        {/* HEADER */}
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <div className="fw-semibold">{asset.name}</div>
                                <div className="text-muted small">
                                    ID: {asset.id}
                                </div>
                            </div>

                            <div className="text-end">
                                <span
                                    className={`badge me-2 ${asset.type === "sensor"
                                        ? "bg-primary"
                                        : asset.type === "valve"
                                            ? "bg-secondary"
                                            : asset.type === "pipe"
                                                ? "bg-info"
                                                : "bg-dark"
                                        }`}
                                >
                                    {asset.type}
                                </span>

                                <span
                                    className={`badge ${asset.status === "ok"
                                        ? "bg-success"
                                        : asset.status === "warning"
                                            ? "bg-warning text-dark"
                                            : "bg-danger"
                                        }`}
                                >
                                    {asset.status}
                                </span>
                            </div>
                        </div>

                        {/* METADATA GRID */}
                        <div className="row mt-2 small text-muted">
                            <div className="col-md-3">
                                <div>
                                    <strong>Location</strong>
                                </div>
                                <div>
                                    {asset.lat.toFixed(4)},{" "}
                                    {asset.lng.toFixed(4)}
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div>
                                    <strong>Installed</strong>
                                </div>
                                <div>
                                    {new Date(
                                        asset.installed_at
                                    ).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div>
                                    <strong>Last inspection</strong>
                                </div>
                                <div>
                                    {asset.last_inspected_at
                                        ? new Date(
                                            asset.last_inspected_at
                                        ).toLocaleDateString()
                                        : "—"}
                                </div>
                            </div>
                        </div>

                        {/* NOTES */}
                        {asset.notes && (
                            <div className="mt-2">
                                <div className="small text-muted">
                                    Notes
                                </div>
                                <div className="small">
                                    {asset.notes}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <Pagination
                page={pagination.page}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onPageChange={handlePageChange}
            />
        </div>
    );
}