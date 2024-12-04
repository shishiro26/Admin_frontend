"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Stop {
  stopId: string;
  stopName: string;
  stopTimings: string;
  stopDuration: number;
  _id?: string;
}

interface City {
  _id: string;
  cityName: string;
  cityPincode: string;
  stops: Stop[];
}

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function CityListingPage() {
  const API_URL = process.env.BACKEND_URL;
  const router = useRouter();
  const [cities, setCities] = useState<City[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState("createdAt");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [newStop, setNewStop] = useState<Stop>({
    stopName: "",
    stopTimings: "",
    stopDuration: 0,
    stopId: "",
  });

  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/list?page=${currentPage}&limit=10&sort=${sortKey}`
      );
      if (!response.ok) throw new Error("Error fetching cities");
      const data = await response.json();
      setCities(data.cities);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortKey]);

  const handleStopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewStop({ ...newStop, [name]: value });
  };

  const addStop = async () => {
    if (!selectedCity) return;

    const stopWithId = {
      stops: [
        {
          stopName: newStop.stopName,
          stopTimings: newStop.stopTimings,
          stopDuration: newStop.stopDuration.toString(), // Ensure duration is a string
          stopId: newStop.stopName.replace(/\s+/g, "_").toLowerCase(), // Generate a unique stop ID
        },
      ],
    };

    try {
      const response = await fetch(
        `${API_URL}/add-stops/${selectedCity.cityPincode}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(stopWithId),
        }
      );
      if (!response.ok) throw new Error("Failed to add stop");
      fetchCities();
    } catch (error) {
      console.error(error);
    }
  };

  const removeStop = async (stopId: string) => {
    if (!selectedCity) return;
    try {
      const response = await fetch(
        `${API_URL}/delete-stop/${selectedCity.cityPincode}/${stopId}`,
        {
          method: "DELETE",
        }
      );
      console.log(response.status);
      if (!response.ok) throw new Error("Failed to remove stop");
      fetchCities();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex flex-col justify-between  mb-6">
        <h1 className="text-3xl font-semibold text-gray-700 mb-6">
          City Listing
        </h1>

        <div className="flex flex-row items-start justify-between">
          <button
            onClick={() => router.push("/admin/city/createCity")}
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
          >
            Add a City
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <Select value={sortKey} onValueChange={setSortKey}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by CreatedAt" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sortby CreatedAt</SelectLabel>
              <SelectItem value="createdAt">Sort by Created At</SelectItem>
              <SelectItem value="cityName">Sort by City Name</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>City Name</TableHead>
              <TableHead>City Pincode</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cities.map((city) => (
              <TableRow key={city._id} className="hover:bg-gray-50">
                <TableCell>{city.cityName}</TableCell>
                <TableCell>{city.cityPincode}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger>View Stops</DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Stops for {city.cityName}</DialogTitle>
                        <DialogDescription>
                          {city.stops.map((stop) => (
                            <span
                              key={stop.stopId}
                              className="flex justify-between items-center"
                            >
                              <span>
                                {stop.stopName} - {stop.stopTimings} -{" "}
                                {stop.stopDuration} mins
                              </span>
                              <Button
                                onClick={() => removeStop(stop.stopId!)}
                                variant={"destructive"}
                                size={"sm"}
                              >
                                Remove
                              </Button>
                            </span>
                          ))}
                        </DialogDescription>
                      </DialogHeader>
                      <h3 className="text-lg font-semibold mb-1">Add a Stop</h3>
                      <Input
                        type="text"
                        name="stopName"
                        placeholder="Stop Name"
                        value={newStop.stopName}
                        onChange={handleStopChange}
                        className="w-full px-4 py-2 border rounded-md mb-1"
                      />
                      <Input
                        type="time"
                        name="stopTimings"
                        value={newStop.stopTimings}
                        onChange={handleStopChange}
                        className="w-full px-4 py-2 border rounded-md mb-1"
                      />
                      <Input
                        type="number"
                        name="stopDuration"
                        placeholder="Duration in minutes"
                        value={newStop.stopDuration}
                        onChange={handleStopChange}
                        className="w-full px-4 py-2 border rounded-md mb-1"
                      />
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button onClick={addStop} variant={"default"}>
                            Add Stop
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

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
