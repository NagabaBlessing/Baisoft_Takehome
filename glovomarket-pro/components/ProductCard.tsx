import React from 'react';
import { Product, ProductStatus } from '../types';
import { dataService } from '../services/data';
import { Icons } from '../constants';
import { formatUsd, formatUgxFromUsd } from '../services/currency';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const businessName = dataService.getBusinessName(product.businessId);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group border border-gray-100">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
        
        {product.status !== ProductStatus.APPROVED && (
           <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded font-bold uppercase opacity-90">
             {product.status.replace('_', ' ')}
           </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-gray-800 leading-tight">{product.name}</h3>
            <span className="text-right whitespace-nowrap">
                <span className="block text-lg font-bold text-glovo-green">{formatUsd(product.price)}</span>
                <span className="block text-xs text-gray-500">{formatUgxFromUsd(product.price)}</span>
            </span>
        </div>

        <div className="flex items-center text-xs text-gray-500 mb-3">
             <span className="inline-block mr-1 opacity-70"><Icons.Store /></span>
             <span className="font-medium">Sold by: {businessName}</span>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow">{product.description}</p>
        
        <button 
            onClick={() => onViewDetails && onViewDetails(product)}
            className="w-full bg-blue-50 text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-100 transition mt-auto"
        >
            View Details
        </button>
      </div>
    </div>
  );
};