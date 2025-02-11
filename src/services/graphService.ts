
export interface Publication {
  id: string;
  ipfsHash: string;
  publisher: string;
  timestamp: number;
  contentType: 'article' | 'job' | 'resume';
  lgrBalance: string;
  version: number;
}

const MOCK_PUBLICATIONS: Publication[] = [
  {
    id: '1',
    ipfsHash: 'QmXzK2DyEx4dDZrcYLEEyhL1DJP9J9j4VhYYemL6pDD2TX',
    publisher: '0x1234567890123456789012345678901234567890',
    timestamp: Date.now() - 86400000,
    contentType: 'article',
    lgrBalance: '1000000000000000000',
    version: 1
  },
  // Add more mock data as needed
];

export const fetchPublications = async (
  page: number = 1,
  itemsPerPage: number = 10
): Promise<{ publications: Publication[]; hasMore: boolean }> => {
  // Mock implementation
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const publications = MOCK_PUBLICATIONS.slice(start, end);
  
  return {
    publications,
    hasMore: end < MOCK_PUBLICATIONS.length
  };
};
