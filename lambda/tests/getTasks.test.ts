import { handler } from "../src/handlers/getTasks";
import { DynamoDB } from "aws-sdk";

// Mock do DynamoDB
jest.mock("aws-sdk", () => {
  const mockScan = jest.fn();
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        scan: mockScan,
      })),
    },
  };
});

const mockScan = (DynamoDB.DocumentClient.prototype.scan as jest.Mock);

describe("getTasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar todas as tarefas com sucesso", async () => {
    // Configura o mock do scan para retornar um resultado
    mockScan.mockImplementationOnce(() => ({
      promise: jest.fn().mockResolvedValue({
        Items: [{ taskId: "123", title: "Teste" }],
      }),
    }));

    const response = await handler({});

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.tasks).toHaveLength(1);
    expect(body.tasks[0].taskId).toBe("123");
  });

  it("deve retornar erro em caso de falha interna", async () => {
    // Configura o mock do scan para lançar um erro
    mockScan.mockImplementationOnce(() => ({
      promise: jest.fn().mockRejectedValue(new Error("Erro interno")),
    }));

    const response = await handler({});
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe("Erro interno ao obter as tarefas.");
  });
});
