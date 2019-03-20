module.exports = {
  development: {
    dialect: process.env.DB_CONNECTION || 'mysql',
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'birdboard',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    operatorsAliases: false,
    define: {
      underscored: true,
      freezeTableName: false,
      charset: 'utf8',
      dialectOptions: {
        collate: 'utf8_general_ci'
      },
      timestamps: true
    }
  },
  test: {
    database: ':memory:',
    dialect: 'sqlite',
    logging: false,
    operatorsAliases: false,
    define: {
      underscored: true,
      freezeTableName: false,
      charset: 'utf8',
      dialectOptions: {
        collate: 'utf8_general_ci'
      },
      timestamps: true
    }
  },
  production: {
    dialect: process.env.DB_CONNECTION,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false,
    operatorsAliases: false,
    define: {
      underscored: true,
      freezeTableName: false,
      charset: 'utf8',
      dialectOptions: {
        collate: 'utf8_general_ci'
      },
      timestamps: true
    }
  }
};
