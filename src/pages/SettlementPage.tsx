
import React from 'react';
import { useParams } from 'react-router-dom';

const SettlementPage = () => {
  const { settlementId } = useParams();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Settlement Details</h1>
      <p className="mb-4">Viewing settlement ID: {settlementId}</p>
    </div>
  );
};

export default SettlementPage;
