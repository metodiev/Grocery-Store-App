import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

const categories = [
  "Fruits & Vegetables",
  "Meat & Seafood",
  "Dairy & Eggs",
  "Bakery",
  "Beverages",
  "Snacks",
  "Frozen Foods",
  "Pantry",
  "Household",
  "Personal Care"
];

const productTemplates = [
  ["Fresh Red Apples", "Fresh and crispy red apples", 3.99, 2.99, "kg"],
  ["Bananas", "Sweet ripe bananas", 1.79, 1.49, "kg"],
  ["Spinach", "Organic baby spinach", 2.49, 2.19, "pack"],
  ["Tomatoes", "Vine-ripened tomatoes", 2.99, 2.59, "kg"],
  ["Chicken Breast", "Skinless boneless chicken breast", 8.99, 7.99, "kg"],
  ["Atlantic Salmon", "Fresh salmon fillet", 14.99, 12.99, "kg"],
  ["Whole Milk", "Creamy whole milk", 3.49, 2.99, "liter"],
  ["Free Range Eggs", "12-count free range eggs", 4.29, 3.79, "pack"],
  ["Sourdough Bread", "Artisan sourdough loaf", 4.99, 4.49, "piece"],
  ["Butter Croissant", "Flaky butter croissant", 1.99, 1.49, "piece"],
  ["Orange Juice", "100% pure orange juice", 4.79, 3.99, "liter"],
  ["Sparkling Water", "Natural sparkling water", 1.29, null, "bottle"],
  ["Potato Chips", "Sea salt potato chips", 2.99, 2.49, "pack"],
  ["Dark Chocolate", "70% cocoa dark chocolate", 3.29, 2.79, "bar"],
  ["Frozen Pizza", "Cheese frozen pizza", 6.99, 5.99, "piece"],
  ["Frozen Berries", "Mixed frozen berries", 5.99, 4.99, "pack"],
  ["Basmati Rice", "Premium basmati rice", 9.99, 8.49, "bag"],
  ["Olive Oil", "Extra virgin olive oil", 11.99, 9.99, "bottle"],
  ["Dish Soap", "Lemon dish washing liquid", 3.89, 3.39, "bottle"],
  ["Laundry Detergent", "Concentrated laundry detergent", 12.99, 10.99, "bottle"],
  ["Shampoo", "Moisturizing shampoo", 6.49, 5.49, "bottle"],
  ["Toothpaste", "Fresh mint toothpaste", 2.99, 2.49, "tube"],
  ["Cucumber", "Fresh green cucumber", 1.19, 0.99, "piece"],
  ["Strawberries", "Sweet strawberries", 4.49, 3.99, "pack"],
  ["Greek Yogurt", "Plain greek yogurt", 4.99, 4.29, "cup"],
  ["Cheddar Cheese", "Aged cheddar cheese", 5.49, 4.79, "pack"],
  ["Muffin Pack", "Blueberry muffin pack", 5.99, 5.29, "pack"],
  ["Cola Drink", "Refreshing cola beverage", 2.49, 1.99, "bottle"],
  ["Trail Mix", "Nut and raisin trail mix", 4.29, 3.79, "pack"],
  ["Canned Beans", "Protein rich canned beans", 1.99, 1.69, "can"]
];

async function main() {
  console.log("Seeding data...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const userPassword = await bcrypt.hash("User12345", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Groca Admin",
      email: "admin@groca.com",
      password: adminPassword,
      role: "ADMIN",
      phone: "+1-555-0100"
    }
  });

  const users = await prisma.user.createMany({
    data: [
      {
        name: "Olivia Stone",
        email: "olivia@example.com",
        password: userPassword,
        role: "USER",
        phone: "+1-555-0101"
      },
      {
        name: "Liam Park",
        email: "liam@example.com",
        password: userPassword,
        role: "USER",
        phone: "+1-555-0102"
      }
    ]
  });

  void users;

  const createdCategories = [];
  for (const name of categories) {
    const created = await prisma.category.create({
      data: {
        name,
        slug: slugify(name, { lower: true, strict: true }),
        description: `${name} essentials for daily shopping`,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
      }
    });
    createdCategories.push(created);
  }

  for (let i = 0; i < productTemplates.length; i += 1) {
    const [name, description, price, discountPrice, unit] = productTemplates[i];
    const category = createdCategories[i % createdCategories.length];

    await prisma.product.create({
      data: {
        name,
        slug: slugify(`${name}-${i + 1}`, { lower: true, strict: true }),
        description,
        price,
        discountPrice,
        stock: 25 + i * 3,
        unit,
        image: `https://picsum.photos/seed/groca-${i + 1}/800/600`,
        isFeatured: i < 8,
        isActive: true,
        categoryId: category.id
      }
    });
  }

  const olivia = await prisma.user.findUnique({ where: { email: "olivia@example.com" } });
  if (olivia) {
    const userProducts = await prisma.product.findMany({ take: 3, orderBy: { createdAt: "desc" } });
    const subtotal = userProducts.reduce((acc, p) => acc + Number(p.discountPrice ?? p.price), 0);
    const deliveryFee = subtotal > 30 ? 0 : 4.99;
    const discount = userProducts.reduce((acc, p) => {
      const base = Number(p.price);
      const discounted = Number(p.discountPrice ?? p.price);
      return acc + Math.max(0, base - discounted);
    }, 0);

    await prisma.order.create({
      data: {
        userId: olivia.id,
        subtotal,
        deliveryFee,
        discount,
        total: subtotal + deliveryFee,
        paymentMethod: "COD",
        paymentStatus: "PENDING",
        status: "CONFIRMED",
        shippingAddress: {
          fullName: "Olivia Stone",
          phone: "+1-555-0101",
          address: "25 Market Street",
          city: "San Francisco",
          postalCode: "94103",
          instructions: "Ring once"
        },
        items: {
          create: userProducts.map((p) => {
            const priceToUse = Number(p.discountPrice ?? p.price);
            return {
              productId: p.id,
              name: p.name,
              image: p.image,
              price: priceToUse,
              unit: p.unit,
              quantity: 1,
              lineTotal: priceToUse
            };
          })
        }
      }
    });
  }

  await prisma.cart.create({
    data: {
      userId: admin.id
    }
  });

  console.log("Seeding completed successfully.");
  console.log("Admin credentials (development only): admin@groca.com / Admin123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
