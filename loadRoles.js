const Role = require("./models/role");
const connectDB = require("./db/connect");
require("dotenv").config();

const handleRoles = async () =>{
    try {
        await connectDB(process.env.MONGO_URI);//? connect to the database

        const enumValues = Role.getEnumValues();//? get the enum values from the Role model

        const roles = enumValues.map((role) => {
            return { roleName: role };
        });

        const existingRolesDB = await Role.find();//? get the roles from the database

        const newRolesToAdd = roles.filter((role) => {
            return !existingRolesDB.some(existingRole => existingRole.roleName === role.roleName);
        });

        await Role.create(newRolesToAdd);//?new roles loaded to the database

        console.log(`in the enum : ${enumValues}\nin the db : ${existingRolesDB}\nnew roles added : ${newRolesToAdd}\ntheir number : ${newRolesToAdd.length}`);
        console.log("Roles added successfully🤌");
        process.exit(0);
    } catch (error) {
        console.log(error.message);
        process.exit(0);
    }
};
handleRoles();