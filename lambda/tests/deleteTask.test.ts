import { handler } from "../src/handlers/getTasks";
import { DynamoDB } from "aws-sdk";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Declare mockScan before jest.mock
let mockScan: jest.Mock;

// Mock the aws-sdk module
jest.mock("aws-sdk", () => {
  // Initialize mockScan within the mock factory
  mockScan = jest.fn();
  
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

  it("should return all tasks successfully", async () => {
    mockScan.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValue({
        Items: [{ taskId: "123", title: "Test" }],
      }),
    });

    const response = await handler({});

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.tasks).toHaveLength(1);
    expect(body.tasks[0].taskId).toBe("123");
  });

  it("should return an error in case of internal failure", async () => {
    mockScan.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValue(new Error("Internal Error")),
    });

    const response = await handler({});
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe("Erro interno ao obter as tarefas.");
  });
});
