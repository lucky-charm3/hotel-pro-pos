const User = require('../models/userModel');

const userRepository = {
  findAllUsers: async (search, limit = 20, offset = 0) => {
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    return await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);
  },

  findUsersByRole: async (role, search, limit = 20, offset = 0) => {
    let query = { role, isActive: true };
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    return await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);
  },
  
  countUsers:async(search, limit, offset)=>{
 let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    return await User.countDocuments(query)  
  },

  findUserById: async (id) => {
    return await User.findById(id).select('-password');
  },

  findUserByUsernameOrEmail: async (username, email) => {
    return await User.findOne({
      $or: [{ username }, { email }],
      isActive: true
    });
  },

  findUserByUsername:async (name)=>{
    return await User.findByUsername(name);
  },

  createUser: async (userData) => {
    const user = new User(userData);
    return await user.save();
  },

  updateUser: async (id, updateData) => {
    return await User.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');
  },

  deleteUser: async (id) => {
    return await User.findByIdAndUpdate(
      id, 
      { isActive: false }, 
      { new: true }
    );
  }
};

module.exports = userRepository;