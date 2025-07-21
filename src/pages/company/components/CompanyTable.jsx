import React from "react";
import "./CompanyTable.css";

export const CompanyTable = ({ companies, onEdit, onDelete }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200 table-all">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Short Name
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Description
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Phone Number
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {companies.length > 0 ? (
          companies.map((company) => (
            <tr key={company.id}>
              <td className="px-6 py-4 whitespace-nowrap text-center">{company.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center">{company.shortName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {company.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {company.phoneNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex justify-center space-x-2 gap-2 button-table">
                  <button
                    onClick={() => onEdit(company)}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(company.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
              No companies found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
