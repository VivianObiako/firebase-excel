"use client";

import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  endBefore,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { database } from "../firebase.js";
import * as XLSX from "xlsx";

export default function Home() {
  const [data, setData] = useState(null);
  const [allData, setAllData] = useState([]);
  const [allDataLength, setAllDataLength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchData = async (direction) => {
    setLoading(true);
    let dataRef = collection(database, "otpcodes");
    let q;

    if (direction === "next" && lastDoc) {
      q = query(dataRef, orderBy("otp"), startAfter(lastDoc), limit(pageSize));
    } else if (direction === "prev" && firstDoc) {
      q = query(dataRef, orderBy("otp"), endBefore(firstDoc), limit(pageSize));
    } else {
      q = query(dataRef, orderBy("otp"), limit(pageSize));
    }

    const snapshot = await getDocs(q);
    const fetchedData = snapshot.docs.map((doc) => doc.data());

    setData(fetchedData);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setFirstDoc(snapshot.docs[0]);
    setLoading(false);
  };

  const formatDate = (milliseconds) => {
    const date = new Date(milliseconds);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNextPage = () => {
    if (page > 999) {
      return;
    }

    setPage(page + 1);
    fetchData("next");
  };

  const handlePrevPage = () => {
    if (page === 1) {
      return;
    }

    setPage(page - 1);
    fetchData("prev");
  };

  const exportToExcel = async () => {
    let dataRef = collection(database, "otpcodes");
    let lastVisible = null;
    let allFetchedData = [];
    const pageSize = 100; // Adjust the page size as needed
    setLoading(true);
  
    while (true) {
      let q;
      q = query(dataRef, orderBy("otp"), startAfter(true), limit(pageSize));
  
      const snapshot = await getDocs(q);
      const fetchedData = snapshot.docs.map((doc) => doc.data());
      allFetchedData = allFetchedData.concat(fetchedData);
      setAllDataLength(allFetchedData.length);
  
      if (snapshot.docs.length < pageSize) {
        break;
      }
  
      if (allFetchedData.length > 9999) {
        break;
      }
    }
  
    setAllData(allFetchedData);
    setLoading(false);
    downloadExcel(allFetchedData);
  };
  
  const downloadExcel = (data) => {
    // Ensure data is not null or undefined
    if (!data || data.length === 0) {
      console.error("No data fetched or data is null");
      return;
    }
  
    // Create a new array with the desired column order
    const orderedData = data.map(item => ({
      otp: item.otp,
      used_unused: item.used_unused,
      date_used: item.used_unused === 'Used' ? formatDate(item.date_used) : '',
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(orderedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OTPCodes");
    XLSX.writeFile(workbook, "OTPCodes.xlsx");
  };

  return (
    <div className="grid items-center justify-items-center p-8 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="flex justify-between items-center w-full">
        <h1 className="font-bold">TOUR GUIDING OTP CODES</h1>
        <div className="ml-3 flex justify-between items-center gap-2">
          <button
            disabled={loading}
            onClick={exportToExcel}
            style={{ width: "-webkit-fill-available"}}
            className="px-3 py-1 h-10 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
          >
            {(loading && allDataLength > 0) ? `Exporting ${allDataLength}...` : "Export to Excel"}
          </button>
          <div className="w-full max-w-sm min-w-[200px] relative">
            <div className="relative">
              <input
                className="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                placeholder="Search for invoice..."
              />
              <button
                className="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded "
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                  stroke="currentColor"
                  className="w-8 h-8 text-slate-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex flex-col w-full h-full overflow-auto text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  ID
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  OTP code
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Used/UnUsed
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  Date Used
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70"></p>
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => (
              <tr key={index}>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {index + 1}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {item.otp}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {item.used_unused}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                    {formatDate(item.date_used)}
                  </p>
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  <a
                    href="#"
                    className="cursor-not-allowed block font-sans text-sm antialiased font-medium leading-normal text-blue-gray-900"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center px-4 py-3">
          <div className="text-sm text-slate-500">
            Showing{" "}
            <b>
              {(page - 1) * pageSize + 1}-{page * pageSize}
            </b>{" "}
            of 10000 entries
          </div>
          <div className="flex space-x-1">
            <button
              onClick={handlePrevPage}
              className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
            >
              Prev
            </button>
            {page - 1 > 0 && (
              <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                {page - 1}
              </button>
            )}
            <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-white bg-slate-800 border border-slate-800 rounded hover:bg-slate-600 hover:border-slate-600 transition duration-200 ease">
              {page}
            </button>
            {page + 1 < 1000 && (
              <button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
                {page + 1}
              </button>
            )}
            <button
              onClick={handleNextPage}
              className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
