import { faker } from "@faker-js/faker/.";
import mysql from "mysql2/promise";
require("dotenv").config();
const { DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } = process.env;

const db = await mysql.createConnection({
  host: "localhost",
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
});

const randomDate = (start: Date, end: Date): string => {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split("T")[0];
};

// Fonction pour insérer des utilisateurs
const seedAccounts = async (count: number) => {
  const accounts = Array.from({ length: count }).map(() => ({
    username: faker.internet.username(),
    password: faker.internet.password(),
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    email: faker.internet.email(),
    birth_date: randomDate(new Date("1980-01-01"), new Date("2003-12-31")),
  }));

  const query = `
INSERT INTO account (username, password, firstname, lastname, email, birth_date)
VALUES (?, ?, ?, ?, ?, ?);
`;

  for (const account of accounts) {
    await db.query(query, [
      account.username,
      account.password,
      account.firstname,
      account.lastname,
      account.email,
      account.birth_date,
    ]);
  }
};

// Fonction pour insérer des marques
async function seedBrands(count: number) {
  const brands = Array.from({ length: count }).map(() => ({
    name: faker.company.name(),
  }));

  const query = `
    INSERT INTO brand (name)
    VALUES (?);
  `;

  for (const brand of brands) {
    await db.query(query, [brand.name]);
  }
}

// Fonction pour insérer des articles
async function seedShoppingItems(count: number) {
  const [brands] = await db.query(`SELECT id FROM brand`);
  const brandIds = (brands as { id: number }[]).map((brand) => brand.id);

  const items = Array.from({ length: count }).map(() => ({
    name: faker.commerce.productName(),
    color: faker.color.human(),
    description: faker.commerce.productDescription(),
    item_image_url: faker.image.url(),
    price: parseFloat(faker.commerce.price({ min: 1, max: 100 })),
    quantity: faker.number.int({ min: 1, max: 1000 }),
    dimensions: `${faker.number.int({
      min: 1,
      max: 100,
    })}x${faker.number.int({ min: 1, max: 100 })}x${faker.number.int({
      min: 1,
      max: 100,
    })}`,
    stock_status: faker.helpers.arrayElement([
      "in_stock",
      "out_of_stock",
      "pre_order",
    ]),
    author: faker.person.fullName(),
    brand_id: faker.helpers.arrayElement(brandIds),
  }));

  const query = `
    INSERT INTO shopping_item (name, color, description, item_image_url, price, quantity, dimensions, stock_status, author, brand_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  for (const item of items) {
    await db.query(query, [
      item.name,
      item.color,
      item.description,
      item.item_image_url,
      item.price,
      item.quantity,
      item.dimensions,
      item.stock_status,
      item.author,
      item.brand_id,
    ]);
  }
}

// Fonction pour insérer des commentaires
async function seedComments(count: number) {
  // Récupérer tous les comptes et articles existants
  const [accounts] = await db.query(`SELECT id FROM account`);
  const [items] = await db.query(`SELECT id FROM shopping_item`);

  const accountIds = (accounts as { id: number }[]).map(
    (account) => account.id
  );
  const itemIds = (items as { id: number }[]).map((item) => item.id);

  const comments = Array.from({ length: count }).map(() => ({
    account_id: faker.helpers.arrayElement(accountIds), // ID de compte aléatoire
    item_id: faker.helpers.arrayElement(itemIds), // ID d'article aléatoire
    likes: faker.number.int({ min: 0, max: 1000 }), // Nombre de likes aléatoires
    comment_text: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })), // Texte de commentaire aléatoire
    rating: faker.number.int({ min: 1, max: 5 }), // Note aléatoire entre 1 et 5
  }));

  const query = `
    INSERT INTO comments (account_id, item_id, likes, comment_text, rating)
    VALUES (?, ?, ?, ?, ?);
  `;

  for (const comment of comments) {
    await db.query(query, [
      comment.account_id,
      comment.item_id,
      comment.likes,
      comment.comment_text,
      comment.rating,
    ]);
  }
}

async function seedDatabase() {
  try {
    console.log("Seeding accounts...");
    await seedAccounts(50);

    console.log("Seeding brands...");
    await seedBrands(10);

    console.log("Seeding shopping items...");
    await seedShoppingItems(100);

    console.log("Seeding comments...");
    await seedComments(200); // Par exemple, 200 commentaires

    console.log("Seeding completed!");
  } catch (error) {
    console.error("Error while seeding the database:", error);
  } finally {
    await db.end();
  }
}

seedDatabase();
