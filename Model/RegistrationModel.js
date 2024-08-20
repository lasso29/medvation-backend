const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const registrationSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: "",
      unique: true, // Ensure email uniqueness
      lowercase: true, // Store email in lowercase
      required: true,
      select: false,
    },
    role: {
      type: String,
      default: "",
      select: false,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const saltRounds = 10;

registrationSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, saltRounds);
      this.password = hashedPassword;
      next();
    } catch (err) {
      console.error("Error hashing password:", err);
      next(err); // Propagate the error to the next middleware or route handler
    }
  } else {
    // Convert the email to lowercase before saving
    if (this.isModified("email")) {
      this.email = this.email.toLowerCase();
    }

    next();
  }
});

const registrationModel = mongoose.model("student", registrationSchema);

module.exports = registrationModel;
