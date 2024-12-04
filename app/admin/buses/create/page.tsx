"use client";
import { useState, useEffect } from "react";
import HeaderWithBackButton from "./headerwithbutton";

interface Owner {
  _id: string;
  name: string;
  username: string;
}
interface Staff {
  _id: string;
  name: string;
  username: string;
}

interface City {
  _id: string;
  cityName: string;
  cityPincode: string;
}

export default function CreateBusPage() {
  const intialFormData = {
    ownerId: "",
    staff: [] as Staff[],
    busCapacity: 0,
    seats: "",
    source: "",
    destination: "",
    busPhotos: null,
    bus3DModels: null,
    restStops: [] as City[],
    busNumber: "",
  };
  const [formData, setFormData] = useState(intialFormData);

  const [owners, setOwners] = useState([]);
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [staff, setStaff] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const fetchOwners = async () => {
    setLoadingOwners(true);
    try {
      const response = await fetch(
        "${process.env.BACKEND_URL}/api/users?page=1&limit=100&sort=name&filter=Owner"
      );
      const data = await response.json();
      setOwners(data.users); // Store owners in state
    } catch (error) {
      console.error("Error fetching owners:", error);
    } finally {
      setLoadingOwners(false);
    }
  };

  const fetchStaff = async () => {
    setLoadingStaff(true);
    try {
      const response = await fetch(
        "${process.env.BACKEND_URL}/api/users?page=1&limit=100&sort=name&filter=Staff"
      );
      const data = await response.json();
      setStaff(data.users); // Store owners in state
    } catch (error) {
      console.error("Error fetching owners:", error);
    } finally {
      setLoadingStaff(false);
    }
  };
  const fetchCities = async () => {
    setLoadingCities(true);
    try {
      console.log("------------------");
      const response = await fetch(
        "${process.env.BACKEND_URL}/api/cities/list?page=1&limit=100"
      );
      const data = await response.json();
      setCities(data.cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoadingCities(false);
    }
  };

  useEffect(() => {
    fetchOwners();
    fetchCities();
    fetchStaff();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files?.[0] || null,
    });
  };

  const handleCitySelect = (city: City) => {
    if (
      !formData.restStops.find((restStop) => restStop._id === city.cityPincode)
    ) {
      setFormData({
        ...formData,
        restStops: [...formData.restStops, city],
      });
    }
  };
  const handleStaffSelect = (selectStaff: Staff) => {
    if (
      !formData.staff.find((staffs: Staff) => staffs._id === selectStaff._id)
    ) {
      setFormData({
        ...formData,
        staff: [...formData.staff, selectStaff],
      });
    }
  };

  const handleCityRemove = (cityId: string) => {
    setFormData({
      ...formData,
      restStops: formData.restStops.filter(
        (city) => city.cityPincode !== cityId
      ),
    });
  };
  const handleStaffRemove = (staffId: string) => {
    setFormData({
      ...formData,
      staff: formData.staff.filter((staff: Staff) => staff._id !== staffId),
    });
  };

  const generateBusId = (busNumber: string) => {
    return `${busNumber.trim().replace(/\s+/g, "_")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      restStops: formData.restStops.map((city) => city.cityPincode), // Convert cities to names
      staff: formData.staff.map((staff) => staff._id), // Send staff IDs
    };

    const { busNumber, ...otherFields } = formattedData;
    const busId = generateBusId(busNumber);

    const payload = {
      busId,
      busNumber,
      ...otherFields,
    };

    console.log(payload);

    try {
      const response = await fetch("${process.env.BACKEND_URL}/api/bus/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log(formattedData);

      if (response.ok) {
        const data = await response.json();
        console.log("Bus created successfully:", data);
        alert("Bus created successfully!");
        setFormData(intialFormData);
      } else {
        console.error("Error creating bus:", response.statusText);
        alert("Failed to create bus. Please try again.");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      alert("An error occurred while creating the bus.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <HeaderWithBackButton
        title="Create a Bus"
        backRoute="/admin/dashboard" // Specify the back route
      />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white shadow-md rounded-lg p-8"
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Create a New Bus
        </h2>

        {/* Owner ID */}
        <label className="block text-gray-600 font-medium mb-2">Owner</label>
        {loadingOwners ? (
          <p className="text-gray-500 mb-4">Loading owners...</p>
        ) : (
          <select
            name="ownerId"
            value={formData.ownerId}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg mb-4 text-gray-600"
            required
          >
            <option value="">Select Owner</option>
            {owners.map((owner: Owner) => (
              <option key={owner._id} value={owner._id}>
                {owner.name || owner.username}
              </option>
            ))}
          </select>
        )}

        {/* Bus Number */}
        <label className="block text-gray-600 font-medium mb-2">
          Bus Number
        </label>
        <input
          type="text"
          name="busNumber"
          value={formData.busNumber}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg mb-4 text-gray-600"
          placeholder="Enter Bus Number"
          required
        />

        {/* Bus Capacity */}
        <label className="block text-gray-600 font-medium mb-2">
          Bus Capacity
        </label>
        <input
          type="number"
          name="busCapacity"
          value={formData.busCapacity}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg mb-4  text-gray-600"
          placeholder="Enter Bus Capacity"
          required
        />

        {/* Source */}
        <label className="block text-gray-600 font-medium mb-2">
          Source Stop
        </label>
        {loadingCities ? (
          <p className="text-gray-500 mb-4">Loading cities...</p>
        ) : (
          <select
            name="source"
            value={formData.source}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg mb-4 text-gray-600"
            required
          >
            <option value="">Select Source</option>
            {cities.map((city) => (
              <option key={city.cityPincode} value={city.cityPincode}>
                {city.cityName}
              </option>
            ))}
          </select>
        )}

        {/* Destination */}
        <label className="block text-gray-600 font-medium mb-2">
          Destination Stop
        </label>
        {loadingCities ? (
          <p className="text-gray-500 mb-4">Loading cities...</p>
        ) : (
          <select
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg mb-4 text-gray-600"
            required
          >
            <option value="">Select Destination</option>
            {cities.map((city) => (
              <option key={city.cityPincode} value={city.cityPincode}>
                {city.cityName}
              </option>
            ))}
          </select>
        )}

        {/* Bus Photos */}
        <label className="block text-gray-600 font-medium mb-2">
          Upload Bus Photos
        </label>
        <input
          type="file"
          name="busPhotos"
          onChange={handleFileChange}
          className="w-full mb-4"
          accept="image/*"
          multiple
        />

        {/* Bus 3D Models */}
        <label className="block text-gray-600 font-medium mb-2">
          Upload Bus 3D Models
        </label>
        <input
          type="file"
          name="bus3DModels"
          onChange={handleFileChange}
          className="w-full mb-4"
          accept=".obj,.fbx,.glb"
          multiple
        />

        {/* Rest Stops */}
        <label className="block text-gray-600 font-medium mb-2">
          Select Rest Stops
        </label>
        {loadingCities ? (
          <p className="text-gray-500 mb-4">Loading cities...</p>
        ) : (
          <div className="mb-4">
            <select
              onChange={(e) => {
                const selectedCity = cities.find(
                  (city) => city.cityPincode === e.target.value
                );
                if (selectedCity) handleCitySelect(selectedCity);
              }}
              className="w-full px-4 py-2 border rounded-lg mb-2"
            >
              <option value="">Select a City</option>
              {cities.map((city) => (
                <option key={city.cityPincode} value={city.cityPincode}>
                  {city.cityName}
                </option>
              ))}
            </select>
            <ul className="mt-2">
              {formData.restStops.map((city) => (
                <li
                  key={city.cityPincode}
                  className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg mb-2"
                >
                  <span>{city.cityName}</span>
                  <button
                    type="button"
                    onClick={() => handleCityRemove(city.cityPincode)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <label className="block text-gray-600 font-medium mb-2">
          Select Staff
        </label>
        {loadingStaff ? (
          <p className="text-gray-500 mb-4">Loading Staff...</p>
        ) : (
          <div className="mb-4">
            <select
              onChange={(e) => {
                const selectedStaff = staff.find(
                  (staff: Staff) => staff._id === e.target.value
                );
                if (selectedStaff) handleStaffSelect(selectedStaff);
              }}
              className="w-full px-4 py-2 border rounded-lg mb-2"
            >
              <option value="">Select Staff</option>
              {staff.map((staffs: Staff) => (
                <option key={staffs._id} value={staffs._id}>
                  {staffs.name || staffs.username}
                </option>
              ))}
            </select>
            <ul className="mt-2">
              {formData.staff.map((staffs: Staff) => (
                <li
                  key={staffs._id}
                  className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg mb-2"
                >
                  <span>{staffs.name || staffs.username}</span>
                  <button
                    type="button"
                    onClick={() => handleStaffRemove(staffs._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}
