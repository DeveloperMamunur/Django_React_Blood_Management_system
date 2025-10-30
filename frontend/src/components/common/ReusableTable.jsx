import React, { useMemo, useState } from "react";

export default function ReusableTable({
  columns = [],
  data = [],
  pageSizeOptions = [10, 25, 50],
  initialPageSize = 10,
  rowKey = "id",
  selectable = false,
  onSelectionChange = () => {},
  onRowClick,
  compact = false,
  className = "",
  actions = [],
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortBy, setSortBy] = useState(null);
  const [selected, setSelected] = useState(new Set());

  const filtered = useMemo(() => {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((v) => String(v ?? "").toLowerCase().includes(q))
    );
  }, [data, query]);

  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    const { key, dir } = sortBy;
    return [...filtered].sort((a, b) => {
      const va = a[key];
      const vb = b[key];
      if (va == null && vb == null) return 0;
      if (va == null) return dir === "asc" ? -1 : 1;
      if (vb == null) return dir === "asc" ? 1 : -1;
      if (typeof va === "number" && typeof vb === "number")
        return dir === "asc" ? va - vb : vb - va;
      return dir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
  }, [filtered, sortBy]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  function toggleSelectAll(checked) {
    if (checked) {
      const s = new Set(pageData.map((r) => r[rowKey]));
      setSelected((prev) => new Set([...Array.from(prev), ...Array.from(s)]));
    } else {
      setSelected((prev) => {
        const copy = new Set(prev);
        pageData.forEach((r) => copy.delete(r[rowKey]));
        return copy;
      });
    }
  }

  function toggleRow(id) {
    setSelected((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) copy.delete(id);
      else copy.add(id);
      onSelectionChange(Array.from(copy));
      return copy;
    });
  }

  function handleSort(col) {
    if (!col.sortable) return;
    setSortBy((cur) => {
      if (!cur || cur.key !== col.key) return { key: col.key, dir: "asc" };
      if (cur.dir === "asc") return { key: col.key, dir: "desc" };
      return null;
    });
  }

  return (
    <div className={`w-full transition-colors duration-200 ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800
              dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100
              text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {total} results
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">Rows:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-2 py-1 rounded-md border border-gray-300 bg-white text-gray-800
              dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100
              text-sm focus:outline-none"
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <table
          className={`min-w-full divide-y ${
            compact ? "text-sm" : "text-base"
          } bg-white dark:bg-gray-900`}
        >
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {selectable && (
                <th className="px-4 py-2">
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200 ${
                    col.className || ""
                  }`}
                >
                  <button
                    onClick={() => handleSort(col)}
                    className="flex items-center gap-2 w-full text-left"
                    aria-sort={
                      sortBy && sortBy.key === col.key
                        ? sortBy.dir === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    <span>{col.title}</span>
                    {col.sortable && (
                      <SortIcon
                        active={sortBy && sortBy.key === col.key}
                        dir={sortBy?.dir}
                      />
                    )}
                  </button>
                </th>
              ))}
              {actions?.length > 0 && (
                  <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-200">
                    Actions
                  </th>
                )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {pageData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No rows found
                </td>
              </tr>
            )}

            {pageData.map((row) => (
              <tr
                key={row[rowKey]}
                className={`transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(row[rowKey])}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleRow(row[rowKey]);
                      }}
                      className="w-4 h-4 accent-indigo-600"
                    />
                  </td>
                )}

                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 align-top text-gray-800 dark:text-gray-100 ${
                      col.cellClass || ""
                    }`}
                  >
                    {col.render ? col.render(row) : row[col.key] ?? "-"}
                  </td>
                ))}
                {actions?.length > 0 && (
                  <td className="px-4 py-3 flex gap-2">
                    {actions.map((action, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(row);
                        }}
                        className={`px-2 py-1 rounded-md text-sm border transition 
                          ${action.className || "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-800"}`}
                      >
                        {action.icon ? <span className="inline-flex items-center gap-1">{action.icon}{action.label}</span> : action.label}
                      </button>
                    ))}
                  </td>
                )}

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          {["First", "Prev", "Next", "Last"].map((label, idx) => {
            const action = [() => setPage(1), () => setPage((p) => Math.max(1, p - 1)), () => setPage((p) => Math.min(totalPages, p + 1)), () => setPage(totalPages)][idx];
            const disabled =
              (label === "First" || label === "Prev") && page === 1
                ? true
                : (label === "Next" || label === "Last") && page === totalPages;

            return (
              <button
                key={label}
                onClick={action}
                disabled={disabled}
                className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700
                  bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                  disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SortIcon({ active, dir }) {
  return (
    <svg
      className={`w-3 h-3 inline-block ${
        active ? "opacity-100 text-indigo-600" : "opacity-40"
      }`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      {(!active || dir === "asc") && (
        <path
          d="M6 9l6-6 6 6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {(!active || dir === "desc") && (
        <path
          d="M18 15l-6 6-6-6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
