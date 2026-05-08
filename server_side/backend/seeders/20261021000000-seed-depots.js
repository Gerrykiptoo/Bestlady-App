'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('PickupStations', [
      {
        id: 1,
        name: 'Nairobi Main Depot',
        address: 'Nairobi CBD, BestLady HQ',
        lat: -1.286389,
        lng: 36.817223,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Mombasa Coastal Depot',
        address: 'Mombasa Island, Custom Road',
        lat: -4.043477,
        lng: 39.668206,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Eldoret North Depot',
        address: 'Eldoret Town, West Street',
        lat: 0.514277,
        lng: 35.269780,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'Nakuru Rift Depot',
        address: 'Nakuru City, Main Highway',
        lat: -0.282730,
        lng: 36.071379,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: 'Thika Industrial Depot',
        address: 'Thika Town, Garissa Road',
        lat: -1.033262,
        lng: 37.069330,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: 'Kisumu Lakeview Depot',
        address: 'Kisumu City, Oginga Odinga St',
        lat: -0.091702,
        lng: 34.767956,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('PickupStations', null, {});
  }
};
