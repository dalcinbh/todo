import { handler } from '../src/handlers/createTask';
import { DynamoDB } from 'aws-sdk';
import { jest } from '@jest/globals';

jest.mock('aws-sdk', () => {
  const mockPut = { promise: jest.fn() };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        put: jest.fn(() => mockPut),
      })),
    },
  };
});

describe('createTask', () => {
  it('deve criar uma tarefa com sucesso', async () => {
    const event = {
      body: JSON.stringify({
        title: 'Comprar leite',
        description: 'Ir ao mercado',
        dueDate: '2023-12-01',
      }),
    };

    const result = await handler(event);
    expect(result.statusCode).toBe(200);
  });
});