const userRepository = require('../repositories/userRepository');
const jwt=require('jsonwebtoken');
const PosError=require('../utils/posError')

const userService = {
  getAllUsers: async (search, limit, offset) => {
    const users= await userRepository.findAllUsers(search, limit, offset);
    return users;
  },

  getTotalUsersCount:async (search, limit, offset) => {
    const usersCount= await userRepository.countUsers(search, limit, offset);
    return usersCount;
  },


  getUsersByRole: async (role, search, limit, offset) => {
    const users= await userRepository.findUsersByRole(role, search, limit, offset);
     if(users.length===0)
    {
      throw new PosError('Users not found',404)
    }
    return users;
  },

  getUserById: async (id) => {
    const user= await userRepository.findUserById(id);
    if(!user)
    {
      throw new PosError('User not found',404)
    }
    return user;
  },

  login:async (name,password)=>{
  const user=await userRepository.findUserByUsername(name);
  if(!user)
  {
    throw new PosError('User not found',404)
  }
  const isPasswordMatching=await user.comparePassword(password);

  if(!isPasswordMatching)
  {
    throw new PosError('Invalid credentials',403);
  }

  const token=jwt.sign(
    {id:user._id},
    process.env.SECRET_KEY,
    {expiresIn:'3h'}
  );

  return {user,token};
  },

  createUser: async (userData) => {
    const { username, email, phone, password, role } = userData;
    
    const existingUser = await userRepository.findUserByUsernameOrEmail(username, email);
    if (existingUser) {
      return { success: false, message: 'Username or email already exists' };
    }

    const newUser = await userRepository.createUser({
      username,
      email,
      phone,
      password,
      role
    });

    return { success: true, id: newUser._id };
  },

  updateUser: async (id, userData) => {
    const { email, phone, role, password } = userData;
    
    const updateData = { email, phone, role };
    if (password) {
      updateData.password = password;
    }

    const updated = await userRepository.updateUser(id, updateData);
    if (!updated) {
      return { success: false, message: 'User not found' };
    }

    return { success: true };
  },

  deleteUser: async (id) => {
    const deleted = await userRepository.deleteUser(id);
    if (!deleted) {
      return { success: false, message: 'User not found' };
    }

    return { success: true };
  },

  updateUserProfile: async (id, email, phone) => {
    const updated = await userRepository.updateUser(id, { email, phone });
    if (!updated) {
      return { success: false, message: 'User not found' };
    }

    return { success: true };
  },

  changePassword: async (id, currentPassword, newPassword) => {
    const user = await userRepository.findUserById(id);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return { success: false, message: 'Incorrect current password' };
    }

    user.password = newPassword;
    await user.save();

    return { success: true, message: 'Password updated successfully' };
  },

  lockUser: async (id) => {
    const updated = await userRepository.updateUser(id, { isActive: false });
    if (!updated) {
      return { success: false, message: 'User not found' };
    }

    return { success: true };
  }
};

module.exports = userService;