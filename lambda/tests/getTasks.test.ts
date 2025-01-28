import { handler } from '../src/handlers/getTasks';
import { DynamoDB } from 'aws-sdk';

// Mock do DynamoDB
jest.mock('aws-sdk', () => {
  const mockScan = jest.fn().mockReturnValue({
    promise: jest.fn(),
  });
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        scan: mockScan,
      })),
    },
  };
});

describe('getTasks', () => {
  it('deve listar todas as tarefas com sucesso', async () => {
    const event = {}; // Sem corpo necessário

    // Mock da resposta do DynamoDB
    (DynamoDB.DocumentClient.prototype.scan as jest.Mock).mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce({
        Items: [
          { taskId: '1', title: 'Comprar leite', completed: false },
          { taskId: '2', title: 'Estudar AWS', completed: true },
        ],
      }),
    });

    const result = await handler(event);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).length).toBe(2);
  });

  it('deve retornar erro se o DynamoDB falhar', async () => {
    const event = {};

    // Mock de erro no DynamoDB
    (DynamoDB.DocumentClient.prototype.scan as jest.Mock).mockReturnValueOnce({
      promise: jest.fn().mockRejectedValueOnce(new Error('Erro no DynamoDB')),
    });

    const result = await handler(event);
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Erro ao listar tarefas.');
  });
});