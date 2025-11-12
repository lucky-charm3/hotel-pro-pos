const userService = require('../services/userService');
const asyncHandler=require('../middlewares/asyncHandler');

const userController = {
  getAllUsers: asyncHandler(async (req, res) => {
      const { search, limit = 20, offset = 0 } = req.query;
      const users = await userService.getAllUsers(search, parseInt(limit), parseInt(offset));
      res.status(200).json({ success: true,users ,totalPages:Math.ceil(users.length/limit)});
  }),

  getCashiers: asyncHandler(async (req, res) => {
      const { search, limit = 20, offset = 0 } = req.query;
      const cashiers = await userService.getUsersByRole('cashier', search, parseInt(limit), parseInt(offset));
      res.status(200).json({ success: true,cashiers,totalPages:Math.ceil(cashiers.length/limit) });
  }),

  getUserById: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.status(200).json({ success: true, user });
  }),

  getMe: asyncHandler(async (req, res) => {
      const user = await userService.getUserById(req.user.id);
      res.status(200).json({ success: true, data: user });
  }),

  login:asyncHandler(async (req,res)=>{
    const {name,password}=req.body;
  const response=await userService.login(name,password)
  res.status(200).json({
    success:true,
    user:response.user,
    token:response.token
  })
  }),

  createUser: asyncHandler(async (req, res) => {
      const result = await userService.createUser(req.body);
      res.status(201).json(result);
  }),

  updateUser: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const result = await userService.updateUser(id, req.body);
      res.status(200).json(result);
  }),

  deleteUser: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const result = await userService.deleteUser(id);
      res.status(200).json(result);
  }),

  updateProfile: asyncHandler(async (req, res) => {
      const { email, phone } = req.body;
      const result = await userService.updateUserProfile(req.user.id, email, phone);
      res.status(200).json(result);
  }),

  changePassword: asyncHandler(async (req, res) => {
      const { currentPassword, newPassword } = req.body;
      const result = await userService.changePassword(req.user.id, currentPassword, newPassword);
      res.status(200).json(result);
  }),

  lockAccount: asyncHandler(async (req, res) => {
      const result = await userService.lockUser(req.user.id);
      res.status(200).json(result);
  })
};

module.exports = userController;