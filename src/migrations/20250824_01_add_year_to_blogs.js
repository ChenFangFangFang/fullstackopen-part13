const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: new Date().getFullYear()
    })

    await queryInterface.sequelize.query(
      `ALTER TABLE blogs ADD CONSTRAINT year_check CHECK (year >= 1991 AND year <= ${new Date().getFullYear()})`
    )
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('blogs', 'year')
  }
}
