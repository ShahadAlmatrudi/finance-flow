const Admin = require("../models/Admin");

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  if (admin.password !== password) {
    return res.status(400).json({ message: "Wrong password" });
  }

  res.json({ message: "Login success" });
};

module.exports = { loginAdmin };