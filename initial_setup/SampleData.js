const mongoose = require("mongoose");
const Role = require("../managers/entities/role/Role.mongoModel");
const Permission = require("../managers/entities/permission/Permission.mongoModel");
const RolePermissionMapping = require("../managers/entities/role_permissiom_mapping/RolePermissionMapping.mongoModel");
const User = require("../managers/entities/user/User.mongoModel");
const connectDB = require("../connect/mongo");
const config = require("../config/index.config");
const { hashPassword } = require("../libs/utils");

const permissions = [
  "classroom:createClassroom",
  "classroom:updateClassroom",
  "classroom:getClassrooms",
  "school:createSchool",
  "school:updateSchool",
  "school:addAdmin",
  "school:getSchools",
  "student:enroll",
  "student:transfer",
  "user:createUser",
  "user:updateProfile",
  "user:loginUser",
];

const roles = [
  { name: "super-admin", description: "Has all permissions." },
  {
    name: "admin",
    description: "Has all classroom, student, and user permissions.",
  },
  { name: "student", description: "Has only user permissions." },
];

async function createPermissions(session) {
  for (const permission of permissions) {
    const existingPermission = await Permission.findOne({
      name: permission,
    }).session(session);
    if (!existingPermission) {
      const newPermission = new Permission({ name: permission });
      await newPermission.save({ session });
      console.log(`Added permission: ${permission}`);
    } else {
      console.log(`Permission already exists: ${permission}`);
    }
  }
}

async function createRoles(session) {
  for (const role of roles) {
    const existingRole = await Role.findOne({ name: role.name }).session(
      session
    );
    if (!existingRole) {
      const newRole = new Role({
        name: role.name,
        description: role.description,
      });
      await newRole.save({ session });
      console.log(`Added role: ${role.name}`);
    } else {
      console.log(`Role already exists: ${role.name}`);
    }
  }
}

async function addSuperAdmin(session) {
  const superAdminRole = await Role.findOne({ name: "super-admin" }).session(
    session
  );
  const superAdminEmail = config.dotEnv.SUPERADMIN_EMAIL;
  const superAdminPassword = config.dotEnv.SUPERADMIN_PASSWORD;
  const hashedPassword = await hashPassword(superAdminPassword);

  const existingSuperAdmin = await User.findOne({
    email: superAdminEmail,
  }).session(session);
  if (!existingSuperAdmin) {
    const superAdmin = new User({
      name: "Super Admin",
      email: superAdminEmail,
      password: hashedPassword,
      role: superAdminRole._id,
    });
    await superAdmin.save({ session });
    console.log(`Added super-admin user: ${superAdminEmail}`);
  } else {
    console.log(`Super admin user already exists: ${superAdminEmail}`);
  }
}

async function createRolePermissionMappings(session) {
  const superAdminRole = await Role.findOne({ name: "super-admin" }).session(
    session
  );
  const adminRole = await Role.findOne({ name: "admin" }).session(session);
  const studentRole = await Role.findOne({ name: "student" }).session(session);

  const superAdminPermissions = await Permission.find().session(session);
  const adminPermissions = [
    "classroom:createClassroom",
    "classroom:updateClassroom",
    "classroom:getClassrooms",
    "student:enroll",
    "student:transfer",
    "user:createUser",
    "user:updateProfile",
    "user:loginUser",
  ];
  const studentPermissions = [
    "user:createUser",
    "user:updateProfile",
    "user:loginUser",
  ];

  for (const permission of superAdminPermissions) {
    const existingMapping = await RolePermissionMapping.findOne({
      role_id: superAdminRole._id,
      permission_id: permission._id,
    }).session(session);
    if (!existingMapping) {
      const newMapping = new RolePermissionMapping({
        role_id: superAdminRole._id,
        permission_id: permission._id,
      });
      await newMapping.save({ session });
      console.log(`Mapped permission: ${permission.name} to super-admin`);
    }
  }

  for (const permissionName of adminPermissions) {
    const permissionDoc = await Permission.findOne({
      name: permissionName,
    }).session(session);
    const existingMapping = await RolePermissionMapping.findOne({
      role_id: adminRole._id,
      permission_id: permissionDoc._id,
    }).session(session);
    if (!existingMapping) {
      const newMapping = new RolePermissionMapping({
        role_id: adminRole._id,
        permission_id: permissionDoc._id,
      });
      await newMapping.save({ session });
      console.log(`Mapped permission: ${permissionName} to admin`);
    }
  }

  for (const permissionName of studentPermissions) {
    const permissionDoc = await Permission.findOne({
      name: permissionName,
    }).session(session);
    const existingMapping = await RolePermissionMapping.findOne({
      role_id: studentRole._id,
      permission_id: permissionDoc._id,
    }).session(session);
    if (!existingMapping) {
      const newMapping = new RolePermissionMapping({
        role_id: studentRole._id,
        permission_id: permissionDoc._id,
      });
      await newMapping.save({ session });
      console.log(`Mapped permission: ${permissionName} to student`);
    }
  }
}

async function setup() {
  let session;

  try {
    await connectDB({ uri: config.dotEnv.MONGO_URI });
    console.log("connected to mongodb1");

    session = await mongoose.startSession();
    session.startTransaction();

    await createPermissions(session);
    await createRoles(session);
    await createRolePermissionMappings(session);
    await addSuperAdmin(session);

    await session.commitTransaction();
    console.log("Roles and permissions setup complete!");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error during setup:", error);

    if (session) {
      await session.abortTransaction();
    }

    await mongoose.disconnect();
  } finally {
    session?.endSession();
  }
}

setup();
