/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import Inventory from './components/Inventory';
import AddItem from './components/AddItem';
import Settings from './components/Settings';
import { MOCK_PRODUCTS } from './constants';
import { Product } from './types';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

  const handleAddProduct = (product: Product) => {
    setProducts([product, ...products]);
    setActiveTab('pantry');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleToggleUsed = (id: string) => {
    // In a real app, this might move to a "Used" history
    setProducts(products.filter(p => p.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home products={products} onDelete={handleDeleteProduct} />;
      case 'pantry':
        return <Inventory products={products} onToggleUsed={handleToggleUsed} />;
      case 'add':
        return <AddItem onAdd={handleAddProduct} />;
      case 'settings':
        return <Settings />;
      default:
        return <Home products={products} onDelete={handleDeleteProduct} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <AnimatePresence mode="wait">
        <React.Fragment key={activeTab}>
          {renderContent()}
        </React.Fragment>
      </AnimatePresence>
    </Layout>
  );
}
