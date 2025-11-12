const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Sale = require('./models/saleModel');
const Banking = require('./models/bankingModel');
const Expense = require('./models/expenseModel');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' MongoDB Connected...');
  } catch (err) {
    console.error(` Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

const usersData = [
  { username: 'helenj', email: 'helen.admin@methynix.com', phone: '255712345678', role: 'admin', password: '1234Ayman@' },
  { username: 'methodm', email: 'method.manager@methynix.com', phone: '255712345679', role: 'manager', password: '1234Ayman@' },
  { username: 'jamesc', email: 'james.cashier@methynix.com', phone: '255712345680', role: 'cashier', password: '1234Ayman@' },
];

const productsData = [
  { name: 'Soda (Coke)', barcode: '00112233', price: 1000, stock: 50, category: 'drinks' },
  { name: 'Candy Bar', barcode: '00223344', price: 500, stock: 150, category: 'food' },
  { name: 'Laptop Repair Service', barcode: '00334455', price: 30000, stock: 999, category: 'services' },
  { name: 'Notebook', barcode: '00445566', price: 2500, stock: 25, category: 'others' },
  { name: 'Juice Bottle', barcode: '00556677', price: 2000, stock: 40, category: 'drinks' },
];

const importData = async () => {
  await connectDB();
  try {
    console.log(' Clearing existing data...');
    await User.deleteMany();
    await Product.deleteMany();
    await Sale.deleteMany();
    await Banking.deleteMany();
    await Expense.deleteMany();

    console.log(' Seeding Users...');
    const createdUsers = await User.create(usersData);
    const cashierUser = createdUsers.find(u => u.username === 'jamesc');

    console.log(' Seeding Products...');
    const createdProducts = await Product.create(productsData);

    if (cashierUser) {
      console.log(' Seeding Sales...');
      const salesData = Array.from({ length: 5 }).map((_, i) => {
        const product1 = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        const product2 = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        const qty1 = Math.floor(Math.random() * 5) + 1;
        const qty2 = Math.floor(Math.random() * 5) + 1;

        const items = [
          { product: product1._id, productName: product1.name, price: product1.price, quantity: qty1, subtotal: product1.price * qty1 },
          { product: product2._id, productName: product2.name, price: product2.price, quantity: qty2, subtotal: product2.price * qty2 },
        ];

        const totalPrice = items.reduce((acc, item) => acc + item.subtotal, 0);
        const methods = ['cash', 'card', 'mobile', 'transfer'];
        const statuses = ['completed', 'refunded', 'cancelled'];

        return {
          cashier: cashierUser._id,
          items,
          totalPrice,
          paymentMethod: methods[Math.floor(Math.random() * methods.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
        };
      });
      await Sale.create(salesData);
    }

    if (cashierUser) {
      console.log(' Seeding Banking Transactions...');
      const types = ['deposit', 'withdrawal', 'transfer'];
      const bankingData = Array.from({ length: 5 }).map((_, i) => ({
        type: types[Math.floor(Math.random() * types.length)],
        amount: Math.floor(Math.random() * 80000) + 5000,
        performedBy: cashierUser._id,
        description: `Transaction ${i + 1}`,
      }));
      await Banking.create(bankingData);
    }

    if (cashierUser) {
      console.log(' Seeding Expenses...');
      const categories = [
        'utilities', 'rent', 'maintenance', 'transportation',
        'security', 'inventory', 'supplies', 'salaries',
        'advertising', 'software', 'bank_charges', 'loan_interest', 'miscellaneous'
      ];
      const expenseData = Array.from({ length: 5 }).map((_, i) => ({
        name: `Expense ${i + 1}`,
        amount: Math.floor(Math.random() * 10000) + 1000,
        category: categories[Math.floor(Math.random() * categories.length)],
        recordedBy: cashierUser._id,
        description: `Expense for ${categories[Math.floor(Math.random() * categories.length)]}`,
      }));
      await Expense.create(expenseData);
    }

    console.log(' Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(` Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
