import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
	LuChevronLeft,
	LuChevronRight,
	LuChevronsLeft,
	LuChevronsRight,
} from "react-icons/lu";
import { BsChevronDown } from "react-icons/bs";

import type { PageSize } from "@/hooks/usePagination";

interface PaginationControlsProps {
	currentPage: number;
	totalPages: number;
	pageSize: PageSize;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: PageSize) => void;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

const PAGE_SIZE_OPTIONS: PageSize[] = [5, 10, 20, 50];

export function PaginationControls({
	currentPage,
	totalPages,
	pageSize,
	onPageChange,
	onPageSizeChange,
	hasNextPage,
	hasPrevPage,
}: PaginationControlsProps) {
	const [pageInput, setPageInput] = useState(currentPage.toString());
	const { t } = useTranslation();

	// Sync input with current page when it changes externally
	useEffect(() => {
		setPageInput(currentPage.toString());
	}, [currentPage]);

	const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		// Only allow numeric input
		if (/^\d*$/.test(value)) {
			setPageInput(value);
		}
	};

	const handlePageInputBlur = () => {
		const page = parseInt(pageInput, 10);
		if (!isNaN(page) && page >= 1 && page <= totalPages) {
			onPageChange(page);
		} else {
			setPageInput(currentPage.toString());
		}
	};

	const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handlePageInputBlur();
		}
	};

	const buttonBaseClass =
		"p-1.5 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1";
	const buttonEnabledClass =
		"text-gray-700 hover:bg-amber-100 hover:text-amber-800";
	const buttonDisabledClass = "text-gray-300 cursor-not-allowed";

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-gray-200">
			{/* Page size selector */}
			<div className="flex items-center gap-2 text-sm text-gray-600">
				<span className="font-medium">{t("PAGINATION.SHOW")}</span>
				<div className="relative">
					<select
						value={pageSize}
						onChange={(e) =>
							onPageSizeChange(parseInt(e.target.value, 10) as PageSize)
						}
						className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1.5 pr-8 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 cursor-pointer"
					>
						{PAGE_SIZE_OPTIONS.map((size) => (
							<option key={size} value={size}>
								{size}
							</option>
						))}
					</select>
					<div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
						<BsChevronDown className="w-3 h-3 text-gray-600" />
					</div>
				</div>
				<span className="font-medium">{t("PAGINATION.PER_PAGE")}</span>
			</div>

			{/* Page navigation */}
			<div className="flex items-center gap-1">
				{/* First page button */}
				<button
					onClick={() => onPageChange(1)}
					disabled={!hasPrevPage}
					className={`${buttonBaseClass} ${
						hasPrevPage ? buttonEnabledClass : buttonDisabledClass
					}`}
					aria-label={t("PAGINATION.FIRST_PAGE")}
					title={t("PAGINATION.FIRST_PAGE")}
				>
					<LuChevronsLeft className="w-5 h-5" />
				</button>

				{/* Previous page button */}
				<button
					onClick={() => onPageChange(currentPage - 1)}
					disabled={!hasPrevPage}
					className={`${buttonBaseClass} ${
						hasPrevPage ? buttonEnabledClass : buttonDisabledClass
					}`}
					aria-label={t("PAGINATION.PREVIOUS_PAGE")}
					title={t("PAGINATION.PREVIOUS_PAGE")}
				>
					<LuChevronLeft className="w-5 h-5" />
				</button>

				{/* Page input */}
				<div className="flex items-center gap-2 mx-2 text-sm">
					<span className="text-gray-600 font-medium">{t("PAGINATION.PAGE")}</span>
					<input
						type="text"
						value={pageInput}
						onChange={handlePageInputChange}
						onBlur={handlePageInputBlur}
						onKeyDown={handlePageInputKeyDown}
						className="w-12 text-center border border-gray-300 rounded-md py-1 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
						aria-label="Page number"
					/>
					<span className="text-gray-600 font-medium">
						{t("PAGINATION.OF")} {totalPages}
					</span>
				</div>

				{/* Next page button */}
				<button
					onClick={() => onPageChange(currentPage + 1)}
					disabled={!hasNextPage}
					className={`${buttonBaseClass} ${
						hasNextPage ? buttonEnabledClass : buttonDisabledClass
					}`}
					aria-label={t("PAGINATION.NEXT_PAGE")}
					title={t("PAGINATION.NEXT_PAGE")}
				>
					<LuChevronRight className="w-5 h-5" />
				</button>

				{/* Last page button */}
				<button
					onClick={() => onPageChange(totalPages)}
					disabled={!hasNextPage}
					className={`${buttonBaseClass} ${
						hasNextPage ? buttonEnabledClass : buttonDisabledClass
					}`}
					aria-label={t("PAGINATION.LAST_PAGE")}
					title={t("PAGINATION.LAST_PAGE")}
				>
					<LuChevronsRight className="w-5 h-5" />
				</button>
			</div>
		</div>
	);
}
