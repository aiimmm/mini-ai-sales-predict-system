const STATUS_BADGE_CLASSES = {
  Laris: "bg-emerald-900/50 text-emerald-300 border border-emerald-800/60",
  Tidak: "bg-red-900/50 text-red-300 border border-red-800/60",
};

const TABLE_HEADERS = ["Product", "Qty Sold", "Price", "Discount", "Status"];

function formatIDR(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: TABLE_HEADERS.length }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3.5 bg-slate-700 rounded w-full" />
        </td>
      ))}
    </tr>
  );
}

export default function SalesTable({ salesData, totalRecords, isLoading }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <h2 className="font-semibold text-white">Sales Data</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isLoading
              ? "Loading data..."
              : `Showing 50 of ${totalRecords.toLocaleString("id-ID")} products`}
          </p>
        </div>
        <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
          {isLoading ? "..." : `${totalRecords.toLocaleString("id-ID")} total`}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-auto flex-1" style={{ maxHeight: "480px" }}>
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-slate-800">
            <tr className="text-left">
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/70">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              : salesData.map((product) => (
                  <tr
                    key={product.product_id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-white text-sm leading-tight">
                        {product.product_name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {product.product_id}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-300 tabular-nums">
                      {product.sales_quantity.toLocaleString("id-ID")}
                    </td>

                    <td className="px-4 py-3 text-slate-300 tabular-nums whitespace-nowrap">
                      {formatIDR(product.price)}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-medium ${
                          product.discount > 0
                            ? "text-amber-400"
                            : "text-slate-500"
                        }`}
                      >
                        {product.discount}%
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          STATUS_BADGE_CLASSES[product.status] ??
                          "bg-slate-800 text-slate-300"
                        }`}
                      >
                        <span>{product.status === "Laris" ? "●" : "○"}</span>
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {/* Empty state */}
        {!isLoading && salesData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <span className="text-4xl mb-3">📭</span>
            <p className="text-sm">No data found</p>
          </div>
        )}
      </div>
    </div>
  );
}
