const { sql, poolPromise } = require("./db");

async function createTables() {
  try {
    const pool = await poolPromise;

    console.log("Connected to Azure SQL");

    await pool.request().query(`
      IF NOT EXISTS (
        SELECT * FROM sysobjects
        WHERE name='Users' AND xtype='U'
      )
      BEGIN
        CREATE TABLE Users (
          Id INT IDENTITY(1,1) PRIMARY KEY,
          Name VARCHAR(100) NOT NULL,
          Email VARCHAR(255) NOT NULL UNIQUE,
          PasswordHash VARCHAR(255) NOT NULL,
          CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
        );
      END
    `);

    console.log("Users table created/exists");

    await pool.request().query(`
      IF NOT EXISTS (
        SELECT * FROM sysobjects
        WHERE name='Products' AND xtype='U'
      )
      BEGIN
        CREATE TABLE Products (
          Id INT IDENTITY(1,1) PRIMARY KEY,
          UserId INT NOT NULL,
          ProductName VARCHAR(255) NOT NULL,
          Description VARCHAR(MAX) NOT NULL,
          ImageUrl VARCHAR(500) NOT NULL,
          PdfUrl VARCHAR(500) NOT NULL,
          CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),

          CONSTRAINT FK_Products_Users
            FOREIGN KEY (UserId)
            REFERENCES Users(Id)
        );
      END
    `);

    console.log("Products table created/exists");

    await pool.close();

    console.log("All tables are ready!");
  } catch (error) {
    console.error("Table creation failed:");
    console.error(error.message);
  }
}

createTables();