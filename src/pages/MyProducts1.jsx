import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <button className="p-1 rounded-full bg-white dark:bg-gray-800 shadow">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{product.name}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            product.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            product.status === 'Draft' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}>
            {product.status}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="font-bold text-theme-primary">${product.price}</span>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            SKU: {product.sku}
          </div>
        </div>
      </div>
    </div>
  );
};

const MyProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  
  const products = [
    {
      id: 1,
      name: 'Premium T-Shirt',
      description: 'High-quality cotton t-shirt with custom design',
      price: '29.99',
      sku: 'TS-001',
      status: 'Active',
      image: 'https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/cde0/9161/7d3418a365ef54477675380faf33918c?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=bPpokdK9WoK4eTBBouDNaiY7W-NhaUaSkycNUeFSpAXpBinp2FirNQmtWEza3H4SLm6cKyds6SUWKk5wckqOh8ueF2qy~DMwmzqkk3J0xRCu-rrfLsAJ2-0z2SrGMtuYbKUv3grMiWRHGw5a0-xI7pYHjI4Io~vCiha3GVpxf-nxNCtMLuzmn4kiJJZ8VgW8bzVVoGPTX9DnrMRiUuECVNlM-S4s2NvbkpuByxyTxWPqnSyzXFVqk-WZzgmuT~FBBDkH0dS36zGq-mtEp3fvh9YMQhQEkYSCs1C5K2UuFJ8DepKyMVw9VvwhQ8m04eMBAs2wSsfL0ex2QA5zZpeorQ__'
    },
    {
      id: 2,
      name: 'Ceramic Coffee Mug',
      description: 'Durable ceramic mug with your brand logo',
      price: '14.99',
      sku: 'MG-002',
      status: 'Active',
      image: null
    },
    {
      id: 3,
      name: 'Canvas Tote Bag',
      description: 'Eco-friendly canvas bag for everyday use',
      price: '19.99',
      sku: 'TB-003',
      status: 'Draft',
      image: null
    },
    {
      id: 4,
      name: 'Wireless Earbuds',
      description: 'High-quality sound with custom branding',
      price: '89.99',
      sku: 'EB-004',
      status: 'Pending',
      image: null
    },
    {
      id: 5,
      name: 'Leather Notebook',
      description: 'Premium leather-bound notebook with logo embossing',
      price: '24.99',
      sku: 'NB-005',
      status: 'Active',
      image: null
    },
    {
      id: 6,
      name: 'Water Bottle',
      description: 'Stainless steel water bottle with custom design',
      price: '18.99',
      sku: 'WB-006',
      status: 'Active',
      image: null
    }
  ];

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">My Products</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-theme-primary hover:bg-opacity-90 text-white rounded-md">
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
