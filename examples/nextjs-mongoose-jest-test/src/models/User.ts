import { model, models, Schema } from "mongoose";

export type IUser = {
  name: string;
  age: number;
};

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const User = models.User || model("User", UserSchema);

export default User;
