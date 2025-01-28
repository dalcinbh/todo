import { handler } from "../src/handlers/getTasks";
import { DynamoDB } from "aws-sdk";
import * as dotenv from "dotenv";

// Carrega o .env
dotenv.config();

// Mock do DynamoDB
const mockScan = jest.fn();

jest.mock("aws-sdk", () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        scan: mockScan,
      })),
    },
  };
});

describe("getTasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar todas as tarefas com sucesso", async () => {
    mockScan.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValue({
        Items: [{ taskId: "123", title: "Teste" }],
      }),
    });

    const response = await handler({});

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.tasks).toHaveLength(1);
    expect(body.tasks[0].taskId).toBe("123");
  });

  it("deve retornar erro em caso de falha interna", async () => {
    mockScan.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValue(new Error("Erro interno")),
    });

    const response = await handler({});
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe("Erro interno ao obter as tarefas.");
  });
});
