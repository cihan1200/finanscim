import mongoose from "mongoose";

const capitalize = (value) => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      set: capitalize
    },
    lastName: {
      type: String,
      required: true,
      set: capitalize
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
