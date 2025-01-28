// lambda/__mocks__/aws-sdk.ts

// Import Jest's mocking functions
const mockPut = jest.fn();
const mockDelete = jest.fn();
const mockUpdate = jest.fn();
const mockScan = jest.fn();

// Mock the DocumentClient constructor
const DocumentClient = jest.fn(() => ({
  put: mockPut,
  delete: mockDelete,
  update: mockUpdate,
  scan: mockScan,
}));

// Export the mocked DynamoDB
export const DynamoDB = {
  DocumentClient,
};

// Export the mock functions for use in tests
export { mockPut, mockDelete, mockUpdate, mockScan };
