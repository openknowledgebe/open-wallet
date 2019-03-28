const User = require("../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  register: async (_, { user }) => {
    // TODO Valid email format
    // TODO Password is strong enough
    // lowercase the email
    const email = user.email.toLowerCase();
    // Make sure any user has the email
    const dupUser = await User.findOne({ email });
    if (dupUser) {
      throw new Error("An account with that email address already exists.");
    }
    // Hash Password
    const password = await bcrypt.hash(user.password, 10);
    // Register && Return the user
    return User({
      ...user,
      email,
      password
    }).save();
  },
  login: async (_, { email, password }, { res }) => {
    // lowerCase the email && check if the user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    // compare provided password against stored password
    let rightPassword = false;
    if (user) {
      rightPassword = await bcrypt.compare(password, user.password);
    }
    if (!user || !rightPassword) {
      throw new Error("Email or password incorrect.");
    }
    // generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000 // 1d
    });
    // return the user
    return user;
  },
  logout: (_, args, { res }) => {
    res.clearCookie("token");
    return { message: "Successfully logged out" };
  }
};
