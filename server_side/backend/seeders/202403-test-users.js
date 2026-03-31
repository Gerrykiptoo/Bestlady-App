'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash('password123', 10); // Same password for all

    await queryInterface.bulkInsert('Users', [
      {
        id: 'admin-uuid-1234',
        username: 'superadmin',
        email: 'admin@bestlady.com',
        password: hashedPassword,
        phone: '254700123456',
        business_name: 'BestLady Admin',
        business_type: 'institution',
        tier: 'wholesale',
        role: 'admin',
        kyc_status: 'approved',
        wallet_balance: 10000.00,
        credit_limit: 50000.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'agent-uuid-5678',
        username: 'deliveryagent',
        email: 'agent@bestlady.com',
        password: hashedPassword,
        phone: '254711234567',
        business_name: 'Delivery Agent 1',
        business_type: 'institution',
        tier: 'wholesale',
        role: 'agent',
        kyc_status: 'approved',
        wallet_balance: 5000.00,
        credit_limit: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'staff-uuid-9012',
        username: 'operationsstaff',
        email: 'staff@bestlady.com',
        password: hashedPassword,
        phone: '254722345678',
        business_name: 'Operations Staff',
        business_type: 'institution',
        tier: 'wholesale',
        role: 'staff',
        kyc_status: 'approved',
        wallet_balance: 2000.00,
        credit_limit: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', {
      email: ['admin@bestlady.com', 'agent@bestlady.com', 'staff@bestlady.com']
    });
  }
};

