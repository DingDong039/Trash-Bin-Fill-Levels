import { useEffect, useState } from "react";
import { TrashBin } from "../types/type";
import { mockTrashBins } from "../Mock/MockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { FaSortAmountUp, FaSortAmountDown } from "react-icons/fa"; // Icons for sorting

function TrashBinDashboard() {
  const [trashBins, setTrashBins] = useState<TrashBin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term for filtering
  const [sortField, setSortField] = useState<keyof TrashBin>("id"); // Sorting field
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Sorting order

  useEffect(() => {
    const fetchTrashBins = async () => {
      try {
        setTrashBins(mockTrashBins);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrashBins();
  }, []);

  // Filter bins by location (case-insensitive)
  const filteredBins = trashBins.filter((bin) =>
    bin.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting function
  const sortedBins = [...filteredBins].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  // Function to determine the fill color based on fill level
  const getFillColor = (fillLevel: number) => {
    if (fillLevel > 70) {
      return "red";
    } else if (fillLevel > 50) {
      return "orange";
    } else {
      return "#82ca9d"; // Green color for low fill levels
    }
  };

  // Toggle sorting order
  const toggleSort = (field: keyof TrashBin) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="font-bold text-4xl">Trash Bin Fill Levels</h1>
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>
        {/* Sorting Buttons */}
        <div className="mb-4 flex space-x-2">
          <button
            onClick={() => toggleSort("id")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
          >
            Sort by ID{" "}
            {sortField === "id" &&
              (sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />)}
          </button>
          <button
            onClick={() => toggleSort("fillLevel")}
            className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center"
          >
            Sort by Fill Level{" "}
            {sortField === "fillLevel" &&
              (sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />)}
          </button>
        </div>

        {/* Chart */}
        <div className="w-full lg:w-3/4 xl:w-1/2 mx-auto bg-white shadow-lg rounded-lg p-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sortedBins}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="location" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="fillLevel">
                {sortedBins.map((bin) => (
                  <Cell key={bin.id} fill={getFillColor(bin.fillLevel)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table for Trash Bin Data */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Trash Bin Details</h2>
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Location</th>
                <th className="border px-4 py-2">Fill Level</th>
              </tr>
            </thead>
            <tbody>
              {sortedBins.map((bin) => (
                <tr key={bin.id}>
                  <td className="border px-4 py-2">{bin.id}</td>
                  <td className="border px-4 py-2">{bin.location}</td>
                  <td className="border px-4 py-2">{bin.fillLevel}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default TrashBinDashboard;
