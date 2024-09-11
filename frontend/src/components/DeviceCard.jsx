import React from 'react';

const DeviceCard = ({ image, name, status, onClick, isSelected }) => {
  return (
    <div className={`bg-[#e9f3f3d0] p-4 rounded-md w-52 mr-4 text-center cursor-pointer border-2 ${isSelected ? 'border-2 border-brand' : 'border-transparent'}`} onClick={onClick}>
      <img src={image} alt={name} className="w-full h-32 object-contain mb-2" />
      <h2 className="text-lg font-semibold mb-1">{name}</h2>
      <p className={`text-sm ${status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
        {status}
      </p>
    </div>
  );
};

export default DeviceCard;
