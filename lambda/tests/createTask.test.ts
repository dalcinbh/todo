import { handler } from '../src/handlers/createTask';
import { DynamoDB } from 'aws-sdk';

// Mock do DynamoDB
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
    expect(JSON.parse(result.body).message).toBe('Tarefa criada com sucesso!');
  });

  it('deve retornar erro se o corpo da requisição for inválido', async () => {
    const event = {
      body: JSON.stringify({}), // Corpo vazio
    };

    const result = await handler(event);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).message).toBe('Dados inválidos.');
  });
});