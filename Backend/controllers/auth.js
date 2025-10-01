const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.register = async (req, res) => {
  try{
  const { username, password, email, role, address } = req.body;
  if (!username || !password || !email || !role || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, email, role, address });
  await user.save();

  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.status(201).json({ token });
}catch(err){
  return res.status(500).json({ message: err.message });
  console.log(err)
}};

exports.login = async (req, res) => {
  try{
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.status(200).json({ token, role: user.role, user });
}catch(err){
  return res.status(500).json({message:err.message})
}
};

exports.updatePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    console.log(req.body);
    if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Old password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
};


