import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app.js";

describe("Groca API integration", () => {
  it("returns health check", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe("ok");
  });

  it("registers a user, logs in, and fetches current user", async () => {
    const uniqueEmail = `integration-${Date.now()}@example.com`;

    const registerResponse = await request(app).post("/api/auth/register").send({
      name: "Integration User",
      email: uniqueEmail,
      password: "Password123",
      phone: "+1-555-7777"
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.success).toBe(true);
    expect(registerResponse.body.data.user.email).toBe(uniqueEmail);
    expect(registerResponse.body.data.user.password).toBeUndefined();

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: uniqueEmail,
      password: "Password123"
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.success).toBe(true);
    expect(loginResponse.body.data.token).toBeTruthy();

    const token = loginResponse.body.data.token;

    const meResponse = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.success).toBe(true);
    expect(meResponse.body.data.email).toBe(uniqueEmail);
  });

  it("returns seeded categories and paginated products", async () => {
    const categoriesResponse = await request(app).get("/api/categories");
    expect(categoriesResponse.status).toBe(200);
    expect(categoriesResponse.body.success).toBe(true);
    expect(Array.isArray(categoriesResponse.body.data)).toBe(true);
    expect(categoriesResponse.body.data.length).toBeGreaterThanOrEqual(10);

    const productsResponse = await request(app).get("/api/products").query({ page: 1, limit: 12, sort: "price_asc" });
    expect(productsResponse.status).toBe(200);
    expect(productsResponse.body.success).toBe(true);
    expect(Array.isArray(productsResponse.body.data.items)).toBe(true);
    expect(productsResponse.body.data.pagination.page).toBe(1);
  });

  it("supports protected cart and checkout flow", async () => {
    const userEmail = `flow-${Date.now()}@example.com`;

    const register = await request(app).post("/api/auth/register").send({
      name: "Flow User",
      email: userEmail,
      password: "Password123",
      phone: "+1-555-8888"
    });

    const token = register.body.data.token;

    const products = await request(app).get("/api/products").query({ limit: 1 });
    const productId = products.body.data.items[0].id;

    const addCart = await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId, quantity: 1 });

    expect(addCart.status).toBe(201);
    expect(addCart.body.success).toBe(true);
    expect(addCart.body.data.items.length).toBeGreaterThanOrEqual(1);

    const order = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullName: "Flow User",
        phone: "+1-555-8888",
        address: "123 Integration Street",
        city: "Test City",
        postalCode: "12345",
        deliveryInstructions: "Leave at reception",
        paymentMethod: "COD"
      });

    expect(order.status).toBe(201);
    expect(order.body.success).toBe(true);
    expect(order.body.data.id).toBeTruthy();
  });
});
