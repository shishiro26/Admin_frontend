"use client";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
interface Bus {
  ownerName: string;
  sourceCity: string;
  destinationCity: string;
  restStopsCities: string[];
  _id: string;
  busId: string;
  ownerId: string;
  staff: string[];
  busCapacity: number;
  seats: string[];
  source: string;
  destination: string;
  busPhotos: string[];
  bus3DModels: string[];
  earningPerDay: number;
  restStops: string[];
  busNumber: string;
}

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function BusTable() {
  const API_URL = process.env.BACKEND_URL;
  const [buses, setBuses] = useState<Bus[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);

  // Sorting and Filtering State
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterBySeats, setFilterBySeats] = useState<string>("all"); // 'all', 'zero', 'non-zero'
  const [sortKey, setSortKey] = useState<string>("busNumber");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const busesPerPage = 5;

  const fetchBuses = async () => {
    setLoading(true);
    setNoData(false);
    setBuses([]);
    try {
      const filter =
        filterBySeats === "all"
          ? undefined
          : { key: "seats", value: filterBySeats === "zero" ? 0 : { $gt: 0 } };

      const response = await fetch(
        `${API_URL}/admin/list?page=${currentPage}&limit=${busesPerPage}&sort=${sortKey}&order=${sortOrder}&filter=${JSON.stringify(
          filter
        )}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch buses");

      const data = await response.json();
      const busesWithDetails = await Promise.all(
        data.buses.map(
          async (bus: {
            ownerId: unknown;
            source: unknown;
            destination: unknown;
            restStops: unknown[];
          }) => {
            // Fetch owner name
            const ownerResponse = await fetch(
              `${process.env.BACKEND_URL}/api/users/${bus.ownerId}`,
              {
                method: "GET",
              }
            );
            const ownerData = await ownerResponse.json();
            const ownerName = ownerData.name || "Unknown Owner"; // Ensure fallback if owner name is not available

            // Fetch city names for source, destination, and rest stops
            const sourceResponse = await fetch(
              `${process.env.BACKEND_URL}/api/cities/city/${bus.source}`,
              {
                method: "GET",
              }
            );
            const sourceData = await sourceResponse.json();
            const sourceCity = sourceData.city.cityName || "Unknown City"; // Fallback if city name is not available

            const destinationResponse = await fetch(
              `${process.env.BACKEND_URL}/api/cities/city/${bus.destination}`,
              {
                method: "GET",
              }
            );
            const destinationData = await destinationResponse.json();
            console.log(destinationData.city.cityName);
            const destinationCity =
              destinationData.city.cityName || "Unknown City"; // Fallback if city name is not available

            const restStopsCities = await Promise.all(
              bus.restStops.map(async (restStopId: unknown) => {
                const restStopResponse = await fetch(
                  `${process.env.BACKEND_URL}/api/cities/city/${restStopId}`,
                  {
                    method: "GET",
                  }
                );
                const restStopData = await restStopResponse.json();
                return restStopData.city.cityName || "Unknown City";
              })
            );

            // Return updated bus object with all details
            return {
              ...bus,
              ownerName: ownerName,
              sourceCity: sourceCity,
              destinationCity: destinationCity,
              restStopsCities: restStopsCities,
            };
          }
        )
      );
      console.log(busesWithDetails);
      setBuses(busesWithDetails);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching buses:", error);
      setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortKey, sortOrder, filterBySeats]);

  // Sorting handler
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {/* Controls for Sorting and Filtering */}
      <div className="flex items-center justify-between mb-6 space-x-4">
        {/* Filter by Seats */}
        {/* <select
          value={filterBySeats}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="px-4 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black text-sm"
        >
          <option value="all">All Buses</option>
          <option value="">Buses with 0 Seats</option>
          <option value="non-zero">Buses with Non-Zero Seats</option>
        </select> */}

        {/* Sort by Key */}
        <Select value={sortKey} onValueChange={setSortKey}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
              <SelectItem value="busNumber">Bus Number</SelectItem>
              <SelectItem value="busId">Bus ID</SelectItem>
              <SelectItem value="busCapacity">Bus Capacity</SelectItem>
              <SelectItem value="earningPerDay">Earning Per Day</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* Toggle Sort Order */}
        <Button
          type={"button"}
          onClick={toggleSortOrder}
          className="px-4 py-2  text-white rounded-md  transition-colors text-sm"
        >
          {sortOrder === "asc" ? "Sort Ascending" : "Sort Descending"}
        </Button>
      </div>

      {/* Table Layout */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center text-black flex items-center justify-center h-96">
            Loading...
          </div>
        ) : noData ? (
          <div className="text-center text-black flex items-center justify-center h-96">
            No Buses Found
          </div>
        ) : (
          <Table>
            <TableCaption>A list of buses</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Bus Number</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Earning Per Day</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Rest Stops</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buses.map((bus) => (
                <TableRow key={bus._id}>
                  <TableCell>{bus.busId}</TableCell>
                  <TableCell>{bus.busNumber}</TableCell>
                  <TableCell>{bus.busCapacity}</TableCell>
                  <TableCell>₹{bus.earningPerDay}</TableCell>
                  <TableCell>{bus.ownerName}</TableCell>
                  <TableCell>{bus.sourceCity}</TableCell>
                  <TableCell>{bus.destinationCity}</TableCell>
                  <TableCell>{bus.restStopsCities.join(", ")}</TableCell>
                  <TableCell>
                    <Button variant={"link"}>
                      <Link href={`/admin/buses/${bus.busId}/edit`}>
                        Edit Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination className="mt-5">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() =>
                  currentPage > 1 && handlePageChange(currentPage - 1)
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (number) => (
                <PaginationItem key={number}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(number)}
                    className={currentPage === number ? "active" : ""}
                  >
                    {number}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  currentPage < totalPages && handlePageChange(currentPage + 1)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
