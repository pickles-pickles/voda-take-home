import { useSearchParams } from "react-router-dom";

interface PaginationProps {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => Promise<void>;
}

const Pagination = ({
    page,
    pageSize,
    total,
    onPageChange,
}: PaginationProps) => {
    const [searchParams, setSearchParams] =
        useSearchParams();

    const totalPages = Math.ceil(
        total / pageSize
    );

    async function handlePageChange(
        nextPage: number
    ) {
        if (
            nextPage < 1 ||
            nextPage > totalPages
        ) {
            return;
        }

        const params =
            new URLSearchParams(searchParams);

        params.set(
            "page",
            String(nextPage)
        );

        setSearchParams(params);

        await onPageChange(nextPage);
    }

    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav
            aria-label="Asset pagination"
            className="mt-4"
        >
            <ul className="pagination justify-content-center">
                <li
                    className={`page-item ${page === 1
                            ? "disabled"
                            : ""
                        }`}
                >
                    <button
                        className="page-link"
                        onClick={() =>
                            handlePageChange(
                                page - 1
                            )
                        }
                    >
                        Previous
                    </button>
                </li>

                {Array.from(
                    { length: totalPages },
                    (_, index) => {
                        const pageNumber =
                            index + 1;

                        return (
                            <li
                                key={pageNumber}
                                className={`page-item ${pageNumber === page
                                        ? "active"
                                        : ""
                                    }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() =>
                                        handlePageChange(
                                            pageNumber
                                        )
                                    }
                                >
                                    {pageNumber}
                                </button>
                            </li>
                        );
                    }
                )}

                <li
                    className={`page-item ${page === totalPages
                            ? "disabled"
                            : ""
                        }`}
                >
                    <button
                        className="page-link"
                        onClick={() =>
                            handlePageChange(
                                page + 1
                            )
                        }
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination