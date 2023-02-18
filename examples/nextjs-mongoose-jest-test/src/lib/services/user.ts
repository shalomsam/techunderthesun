import User, { IUser } from "../../models/User";

export const fetchUsers = () => User.find({});

export const fetchUser = (id: string) => User.findById(id);

export const createUser = ({ name, age }: IUser) => {
  const user = new User({ name, age });
  return user.save();
};

export const updateUser = (id: string, updates: Partial<IUser>) =>
  User.findByIdAndUpdate(id, updates, { new: true }).exec();

export const deleteUser = (id: string) =>
  User.findByIdAndDelete(id, { new: true }).exec();
