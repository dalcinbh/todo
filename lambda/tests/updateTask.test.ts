import { handler } from "../src/handlers/updateTask";
import { DynamoDB } from "aws-sdk";

// Mock do DynamoDB
jest.mock("aws-sdk", () => {
  const mockUpdate = jest.fn(() => ({
    Attributes: { taskId: "123", title: "Atualizado" },
  }));
  const DocumentClient = {
    update: jest.fn(() => ({ promise: mockUpdate })),
  };
  return { DynamoDB: { DocumentClient: jest.fn(() => DocumentClient) } };
});

describe("updateTask", () => {
  it("deve atualizar uma tarefa com sucesso", async () => {
    const event = {
      pathParameters: { taskId: "123" },
      body: JSON.stringify({ title: "Atualizado" }),
    };
    const response = await handler(event);

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.updatedAttributes.taskId).toBe("123");
    expect(body.updatedAttributes.title).toBe("Atualizado");
  });

  it("deve retornar erro se taskId estiver ausente", async () => {
    const event = { pathParameters: {}, body: JSON.stringify({ title: "Teste" }) };
    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toBe("taskId é obrigatório.");
  });

  it("deve retornar erro se nenhum campo for enviado no body", async () => {
    const event = { pathParameters: { taskId: "123" }, body: JSON.stringify({}) };
    const response = await handler(event);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toBe("É necessário informar ao menos um campo para atualizar.");
  });
});
