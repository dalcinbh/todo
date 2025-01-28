// lambda/tests/jest.setup.ts

// Suprime todas as chamadas para console.error
jest.spyOn(console, 'error').mockImplementation(() => {});
