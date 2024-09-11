import React, { useState } from "react";
import DeviceCard from "../../components/DeviceCard";
import { IoClose } from "react-icons/io5";
import platform from "platform";

const deviceList = [
  {
    id: 1,
    image: "/images/iphone.png", // Path to your image
    name: "iPhone 13",
    status: "Active",
    lastUsed: "2024-09-15",
    dateAdded: "2024-01-10",
  },
  {
    id: 2,
    image: "/images/android.png", // Path to your image
    name: "Samsung Galaxy S21",
    status: "Inactive",
    lastUsed: "2024-08-25",
    dateAdded: "2023-11-05",
  },
  {
    id: 3,
    image: "/images/laptop.png", // Path to your image
    name: "Dell XPS 13",
    status: "Active",
    lastUsed: "2024-09-08",
    dateAdded: "2023-12-15",
  },
];


function getDeviceInfo() {
  const deviceInfo = {
    platform: platform.os.family,       // e.g., 'iOS', 'Windows', 'Android'
    version: platform.os.version,       // OS version
    architecture: platform.os.architecture,  // 32-bit or 64-bit
    browser: platform.name,             // e.g., 'Chrome', 'Safari'
    deviceType: platform.product,       // Device type like 'iPhone', 'Galaxy'
    cores: navigator.hardwareConcurrency || 'N/A', // Number of CPU cores
    memory: navigator.deviceMemory || 'N/A',  // Total device memory
    hostname: navigator.userAgent,     // Device name approximation via userAgent
  };


  if (platform.product) {
      deviceInfo.deviceType = product;
  } else {
    deviceInfo.deviceType = 'Desktop';
  }

  return platform;
}


const HomePage = () => {
  const [devices, setDevices] = useState(deviceList);
  const [selectedDevice, setSelectedDevice] = useState(null);

  console.log("Device details: ", getDeviceInfo())

  const handleDeviceClick = (device) => {
    setSelectedDevice(device);
  };

  return (
    <>
      <div className="w-full h-full flex">
        <div className="w-full h-full px-8 p-4 overflow-hidden flex flex-col">
          <div className="flex flex-col">
            <div className="p-2">
              <h1 className="text-3xl font-semibold">Devices</h1>
            </div>
            <div className="w-full overflow-x-auto p-2">
              <div className="flex flex-row">
                {devices.map((device) => (
                  <DeviceCard
                    key={device.id}
                    image={device.image}
                    name={device.name}
                    status={device.status}
                    lastUsed={device.lastUsed}
                    dateAdded={device.dateAdded}
                    onClick={() => handleDeviceClick(device)}
                    isSelected={selectedDevice?.id === device.id}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="p-2">
              <h1 className="text-3xl font-semibold">Pod</h1>
            </div>
          </div>
        </div>
        <div
          className={`${
            selectedDevice
              ? "max-w-[420px] min-w-[420px] h-full overflow-hidden border-l border-l-gray-100 bg-[#e9f3f3d0]"
              : "w-0 translate-x-4"
          } transition-all`}
        >
          <div className="w-full p-4 flex items-center justify-end">
            <button
              className="flex text-xl p-2 items-center justify-center border-none bg-transparent hover:bg-[#fffffff5] rounded-full"
              onClick={() => {
                setSelectedDevice(null);
              }}
            >
              <IoClose />
            </button>
          </div>

          <div>
            {selectedDevice && (
              <div className="p-4 mt-4 h-full w-full">
                <div className="flex justify-center items-center">
                  <img
                    src={selectedDevice.image}
                    alt={selectedDevice.name}
                    className="w-48 h-24 object-contain mb-2"
                  />
                </div>
                <h2 className="text-2xl font-semibold mb-2 text-center">
                  {selectedDevice.name}
                </h2>
                <div className="px-8 flex flex-col gap-y-2">
                  <div className='flex justify-between'>
                    <p className="font-semibold">Status:</p>
                    <p>{selectedDevice.status}</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className="font-semibold">Last Used:</p>
                    <p>{selectedDevice.lastUsed}</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className="font-semibold">Date Added</p>
                    <p>{selectedDevice.dateAdded}</p>
                  </div>
                </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
