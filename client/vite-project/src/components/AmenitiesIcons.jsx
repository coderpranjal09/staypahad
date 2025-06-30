import React from 'react';
import { FaWifi, FaParking, FaMountain, FaUmbrellaBeach, FaSwimmingPool, FaSnowflake, FaFire, FaUtensils } from 'react-icons/fa';
import { GiWoodCabin, GiRiver } from 'react-icons/gi';
import { IoMdFitness } from 'react-icons/io';

const amenityIcons = {
  wifi: <FaWifi className="text-green-600" title="WiFi" />,
  parking: <FaParking className="text-green-600" title="Parking" />,
  mountainView: <FaMountain className="text-green-600" title="Mountain View" />,
  riverView: <GiRiver className="text-green-600" title="River View" />,
  breakfast: <FaUtensils className="text-green-600" title="Breakfast" />,
  pool: <FaSwimmingPool className="text-green-600" title="Swimming Pool" />,
  ac: <FaSnowflake className="text-green-600" title="Air Conditioning" />,
  heater: <FaFire className="text-green-600" title="Heater" />,
  yoga: <IoMdFitness className="text-green-600" title="Yoga" />,
  cottage: <GiWoodCabin className="text-green-600" title="Cottage" />
};

const AmenitiesIcons = ({ amenities }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {amenities.map(amenity => (
        <div key={amenity} className="text-xl">
          {amenityIcons[amenity] || <span>{amenity}</span>}
        </div>
      ))}
    </div>
  );
};

export default AmenitiesIcons;