import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { productService } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { ProductModal } from '../components/ProductModal';

export const PublicMarketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setProducts(productService.getApprovedProducts());
  }, []);

  return (
    <div>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Fresh Products, <span className="text-glovo-yellow inline-block transform -skew-x-6">Delivered.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Explore our curated marketplace of approved goods. 
          Use the AI assistant at the bottom right to find exactly what you need.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
           <p className="text-gray-400 text-lg">No products available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onViewDetails={(product) => setSelectedProduct(product)}
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};