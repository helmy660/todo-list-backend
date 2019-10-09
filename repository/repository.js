var tablesQuery = require('../databaseCreation/query');

const repository = (Pool) => {

    let dbConnection;
    const getPoolConnection = () => {
        return new Promise((resolve,reject)=>{
            if(!dbConnection){
                Pool.getConnection((err,connection)=>{
                    if(err)
                        reject(err);
                    else{
                        dbConnection=connection
                        resolve();
                    } 
                })
            }
            else{
                if(dbConnection.state === 'disconnected'){
                    console.log("connection is "+dbConnection.state)
                    dbConnection.release();
                    Pool.getConnection((err,connection)=>{
                        if(err)
                            reject(err);
                        else{
                            // refreshing dbConnection with new connection to use
                            console.log("new connection is made!!!")
                            dbConnection=connection
                            resolve();
                        } 
                     })
                }
                else resolve();
            }  
        })  
    }

    // to create required tables instead of create it manually
    const createTables = () => {
        return new Promise((resolve) => {
            getPoolConnection()
            .then(() => {
                var obj = tablesQuery();
                for(const query_str in obj) {
                    dbConnection.query(obj[query_str], (err) => {
                        if (err) {
                            resolve({code:401, msg:'An error while creating required tables', err});
                        }
                        resolve({code:200, msg:'successfully create required tables'});
                    });
                } 
            })
            .catch(err => {
                resolve({code:500, msg:"DB connection error",err});
            })
        });
    }

    // CRUD operations for user accounts
    const checkSignUp = (user) => {
        return new Promise((resolve) => {
            getPoolConnection()
            .then(() => {
                var query_str = "SELECT userID,userName,imageURL FROM Users WHERE (userName = ? or email = ?)";
                var query_var = [user.userName, user.email];
                dbConnection.query(query_str, query_var, async(err,result) => {
                    if (err) {
                        resolve({code:405, msg:"An error while checking user userName or email uniqueness", err});
                    }
                    else {
                        if (!result.length) {  // if the username or email doesn't exist
                            let newUser = await createUser(user);
                            if(newUser.code == 200){
                                let login = await checkLogin(user);
                                if(login.code == 200){
                                    resolve({code:200, msg:"You are logged in", data:login.data});
                                }
                                else {
                                    resolve(login);
                                }
                            }
                            else {
                                resolve(newUser);
                            }
                        }
                        else {  // if the username or email exists
                            resolve({code:401, msg:"The email or userName already exists"});
                        }
                    }
                })
            })
            .catch(err => {
                resolve({code:500,msg:"DB connection error",err})
            })
        });
    }
    
    const checkLogin = (user) => {
        return new Promise((resolve) => {
            getPoolConnection()
            .then(() => {
                var query_str = "SELECT userID,userName,imageURL FROM Users WHERE (email = ? and password = ?)";
                var query_var = [user.email, user.password];
                dbConnection.query(query_str, query_var, (err,result) => {
                    if (err) {
                        resolve({code:405, msg:"An error while checking user credentials", err});
                    }
                    else {
                        if (result.length) {  // if the email exists
                            resolve({code:200, msg:"Login Successfully", data:result[0]});                            
                        }
                        else { // if the email doesn't exist
                            resolve({code:401 , msg:"email or password are wrong"});
                        }
                    } 
                })  
            })
            .catch(err => {
                resolve({code:500,msg:"DB connection error",err})
            })
        });
    }

    const createUser = (user) => {
        return new Promise((resolve) => {
            getPoolConnection()
            .then(() => {
                var query_str = "INSERT INTO Users (userName,password,email,imageURL) values (?,?,?,?)";
                var query_var = [
                    user.userName,
                    user.password,
                    user.email,
                    user.imageURL
                ];
                dbConnection.query(query_str, query_var, async(err, result) => {
                    if (err) {
                        resolve({code:405, msg:"An error while creating a new user account", err});
                    }
                    else {
                        resolve({code:200, msg:"user account set successfully",data:{userID:result.insertId}});    
                    }
                });
                
            })
            .catch(err => {
                resolve({code:500, msg:"DB connection error",err})
            })
        });
    }


    const getUserTodos = (userID) => {
        return new Promise((resolve) => {
            getPoolConnection()
            .then(() => {
                var query_str = "SELECT * FROM ToDo WHERE (userID = ?)";
                var query_var = [userID];
                dbConnection.query(query_str, query_var, async(err, result) => {
                    if (err) {
                        resolve({code:405, msg:"An error while getting all todos", err});
                    }
                    else {
                        resolve({code:200, msg:"getting todo list successfully",data:result});    
                    }
                });
                
            })
            .catch(err => {
                resolve({code:500, msg:"DB connection error",err})
            })
        });
    }


    const createTodo = (userID , todo) => {
        return new Promise((resolve) => {
            getPoolConnection()
            .then(() => {
                var query_str = "INSERT INTO ToDo (userID,title,completed) values (?,?,?)";
                var query_var = [userID, todo.title, todo.completed];
                dbConnection.query(query_str, query_var, async(err, result) => {
                    if (err) {
                        resolve({code:405, msg:"An error while creating new todo", err});
                    }
                    else {
                        resolve({code:200, msg:"creating new todo successfully",data:result});    
                    }
                });
                
            })
            .catch(err => {
                resolve({code:500, msg:"DB connection error",err})
            })
        });
    }

    const removeTodo = (userID, ID) => {
        return new Promise((resolve) => {
            getPoolConnection()
            .then(()=>{
                var query_str = "DELETE FROM ToDo WHERE (userID = ? and ID = ?)";
                var query_var = [userID, ID];
                dbConnection.query(query_str, query_var, (err, result) => {
                    if(err) {
                        resolve({code:500, msg:`An error while deleting a todo with id ${ID}`, err});
                    }
                    resolve({code:200, msg:`successfully remove a todo with id ${ID}`, data:result});
                });  
            })
            .catch(err=>{
                resolve({code:500,msg:"DB connection error",err})
            })
        });
    }

    const updateTodo = (userID, ID) => {
        return new Promise((resolve) => {
            getPoolConnection()
            .then(()=>{
                var query_str = "UPDATE ToDo SET completed=1 WHERE (userID = ? and ID = ?)";
                var query_var = [userID, ID];
                dbConnection.query(query_str, query_var, (err, result) => {
                    if(err) {
                        resolve({code:500, msg:`An error while updating a todo with id ${ID}`, err});
                    }
                    resolve({code:200, msg:`successfully update a todo with id ${ID}`, data:result});
                });  
            })
            .catch(err=>{
                resolve({code:500,msg:"DB connection error",err})
            })
        });
    }

    return Object.create({
        //Prototype objects
        createTables,
        checkSignUp,
        checkLogin,
        createUser,
        getUserTodos,
        createTodo,
        removeTodo,
        updateTodo
    })
}

const connect = (Pool)=>{
    return new Promise((resolve,reject)=>{
        if(!Pool)
            reject(new Error("connection db not supplied.."));
        resolve(repository(Pool));

    })
}

module.exports = connect;