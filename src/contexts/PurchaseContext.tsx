
import React, { createContext, useContext, useState } from 'react';

interface PurchaseContextType {
  selectedAmount: string;
  setSelectedAmount: (amount: string) => void;
  showPurchaseForm: boolean;
  setShowPurchaseForm: (show: boolean) => void;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export const PurchaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedAmount, setSelectedAmount] = useState("");
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);

  return (
    <PurchaseContext.Provider 
      value={{ 
        selectedAmount, 
        setSelectedAmount, 
        showPurchaseForm, 
        setShowPurchaseForm 
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = () => {
  const context = useContext(PurchaseContext);
  if (context === undefined) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }
  return context;
};

