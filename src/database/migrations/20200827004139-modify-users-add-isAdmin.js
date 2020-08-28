'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'is_admin', {
      type: Sequelize.BOOLEAN,
      //sqlite gives error when trying to add a column with allowNull: false to an existing table
      allowNull: process.env.NODE_ENV === 'test' ? true : false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users','isAdmin')
  },
};
