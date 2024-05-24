import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },

  first_name: {
    type: String,
  },

  last_name: {
    type: String,
  },

  password: {
    type: String,
    minLength: 8,
    required: true,
  },

  token: {
    type: String,
    required: false,
  },
});

const UserModel = mongoose.model("Usersss", UsersSchema);

export default UserModel;
