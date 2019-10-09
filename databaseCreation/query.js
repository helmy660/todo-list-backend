module.exports = () => {

    const usersTable = `CREATE TABLE IF NOT EXISTS Users(
        userID INT NOT NULL AUTO_INCREMENT,
        userName VARCHAR(100) NOT NULL,
        email VARCHAR(200) NOT NULL,
        password VARCHAR(200) NOT NULL,
        imageURL VARCHAR(500) NOT NULL, 
        PRIMARY KEY (userID),
        UNIQUE (userName),
        UNIQUE (email)
    )`

    const todoTable = `CREATE TABLE IF NOT EXISTS ToDo(
        ID INT NOT NULL AUTO_INCREMENT,
        userID INT NOT NULL,
        title VARCHAR(100) NOT NULL,
        completed BOOLEAN NOT NULL, 
        PRIMARY KEY (ID),
        FOREIGN KEY(userID) REFERENCES Users(userID) ON DELETE CASCADE
    )`

    return {
        usersTable,
        todoTable
    }
}