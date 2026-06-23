

/* const Assets = () => {
    return (
        <div>Assets</div>
    )
}

export default Assets */

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../store/store";

import {
    setAssets,
    setPagination,
    setLoading,
    setError,
    type Asset,
} from "../store/assetsSlice";

import { getAssets } from "../services/assets";
import Pagination from "../components/Pagination";

export default function Assets() {
    const dispatch = useDispatch();

    const filters = useSelector(
        (state: RootState) => state.filters
    );

    const { items, pagination, loading, error } =
        useSelector(
            (state: RootState) => state.assets
        );

    async function fetchAssets(
        page = pagination.page
    ) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));

            const response = await getAssets({
                page,
                pageSize: pagination.pageSize,
                ...filters,
            });

            dispatch(setAssets(response.data));
            dispatch(
                setPagination(response.pagination)
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

    useEffect(() => {
        fetchAssets(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    async function handlePageChange(
        page: number
    ) {
        await fetchAssets(page);
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

            {/* LIST */}
            <div className="list-group">
                {items.map((asset: Asset) => (
                    <div
                        key={asset.id}
                        className="list-group-item"
                    >
                        <div className="d-flex justify-content-between">
                            <div>
                                <strong>{asset.name}</strong>

                                <div className="text-muted small">
                                    {asset.type} •{" "}
                                    {asset.status}
                                </div>
                            </div>

                            <div className="text-end">
                                <div>
                                    {asset.lat.toFixed(4)},{" "}
                                    {asset.lng.toFixed(4)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* PAGINATION */}
            <Pagination
                page={pagination.page}
                pageSize={pagination.pageSize}
                total={pagination.total}
                onPageChange={handlePageChange}
            />
        </div>
    );
}