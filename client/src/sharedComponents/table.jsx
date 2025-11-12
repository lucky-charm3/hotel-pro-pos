export default function Table({ headers, children }) {
  return (
    <div className="w-full mt-5 overflow-x-auto rounded-lg shadow-md border border-gray-200">
  <div className="min-w-[800px]">
    <table className="min-w-full divide-y divide-gray-200 overflow-x-auto">
      <thead className="bg-gray-100">
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              className="px-6 py-3 text-left font-normal text-xs uppercase tracking-wider"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
    </div>
    </div>
  );
}