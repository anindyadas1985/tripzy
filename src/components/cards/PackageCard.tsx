import React from 'react';
import { Star, Check } from 'lucide-react';
import { Button } from '../common/Button';

interface PackageCardProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  highlights: string[];
  price: number;
  rating: number;
  image: string;
  included: string[];
  onSelect: () => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  title,
  description,
  duration,
  highlights,
  price,
  rating,
  image,
  included,
  onSelect
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-current text-yellow-400" />
            <span className="text-sm text-gray-600">{rating}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        <p className="text-sky-600 text-sm font-medium mb-4">{duration}</p>
        
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Highlights:</h4>
          <ul className="space-y-1">
            {highlights.slice(0, 3).map((highlight, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                <Check className="w-3 h-3 text-green-600" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">₹{price.toLocaleString()}</div>
            <div className="text-sm text-gray-600">per person</div>
          </div>
          <Button onClick={onSelect} size="sm">
            Select Package
          </Button>
        </div>
      </div>
    </div>
  );
};