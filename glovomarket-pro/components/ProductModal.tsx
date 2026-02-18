import React from 'react';
import { Product } from '../types';
import { dataService } from '../services/data';
import { Icons } from '../constants';
import { formatUsd, formatUgxFromUsd } from '../services/currency';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const businessName = dataService.getBusinessName(product.businessId);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full text-gray-800 transition z-10 shadow-sm"
          title="Close product details"
          aria-label="Close product details"
        >
          <Icons.X />
        </button>

        <div className="h-64 flex-shrink-0 overflow-hidden bg-gray-100 relative">
           {product.imageUrl ? (
             <img 
               src={product.imageUrl} 
               alt={product.name}
               className="w-full h-full object-cover"
             />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-400">
               <Icons.Store />
             </div>
           )}
        </div>

        <div className="p-8 overflow-y-auto">
           <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h2>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <span className="mr-1"><Icons.Store /></span>
                  <span className="font-medium">Sold by: {businessName}</span>
                </div>
              </div>
              <span className="text-right ml-4 whitespace-nowrap">
                <span className="block text-2xl font-bold text-glovo-green">{formatUsd(product.price)}</span>
                <span className="block text-xs text-gray-500">{formatUgxFromUsd(product.price)}</span>
              </span>
           </div>

           <div className="prose text-gray-600 mb-8">
             <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Description</h3>
             <p className="text-sm leading-relaxed">{product.description}</p>
           </div>

           <div className="mt-auto">
             <button 
               onClick={onClose}
               className="w-full bg-glovo-yellow text-glovo-dark font-bold py-3 rounded-xl hover:bg-yellow-400 transition transform active:scale-95 shadow-md"
               title="Add product to order"
               aria-label="Add product to order"
             >
               Add to Order (Demo)
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};