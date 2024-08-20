const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registrationModel = require("../Model/RegistrationModel");

module.exports.landing = () => {
  console.log("Showing");
  res.send({ message: "Welcome to MEDVATION." });
};

module.exports.registration = async (req, res) => {
  console.log(req.body);
  const { userName, email, role, password } = req.body;

  try {
    // Check if all required fields are provided
    if (!userName || !email || !role || !password) {
      console.log("Credentials not complete");
      res.status(401).json("Credentials not complete");
    }

    // Check if a user with the same email and role already exists
    const existingUser = await registrationModel.findOne({ email, role });
    if (existingUser) {
      console.log("User with this email and role already exists");
      res.send("User with this email and role already exists");
    } else {
      // If no user is found, proceed with registration
      let form = new registrationModel(req.body);
      await form.save();
      console.log({ message: "Student Registered Successfully" });
      res.status(200).json({ message: "Registration Successful" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
};

module.exports.Login = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  try {
    const user = await registrationModel
      .findOne({ email })
      .select("+email +password");

    if (!user) {
      // User with the provided email does not exist
      res.send("Invalid email");
    } else {
      // Compare the provided password with the hashed password stored in the database
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        // Passwords do not match
        res.send("Invalid password");
      } else {
        // Passwords match, login successful
        // const newUser = await getDUser(req, res, email);

        const userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.cookie("jwt", userToken, {
          maxAge: 900000,
          httpOnly: true,
        });

        const token = userToken.split("").reverse().join("");
        console.log(token);
        res.send({ message: "Login successfully", token });
      }
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
