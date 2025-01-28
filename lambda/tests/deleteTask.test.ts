import { handler } from "../src/handlers/deleteTask";
import { DynamoDB } from "aws-sdk";

// Mock do DynamoDB
jest.mock("aws-sdk", () => {
  const mockDelete = jest.fn();
  const DocumentClient = {
    delete: jest.fn(() => ({ promise: mockDelete })),
  };
  return { DynamoDB: { DocumentClient: jest.fn(() => DocumentClient) } };
});

describe("deleteTask", () => {
  it("deve deletar uma tarefa com sucesso", async () => {
    const event = { pathParameters: { taskId: "123" } };
    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).message).toContain("deletada com sucesso");
  });

  it("deve retornar erro se taskId estiver ausente", async () => {
    const event = { pathParameters: {} };
    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toBe("taskId é obrigatório.");
  });
});
