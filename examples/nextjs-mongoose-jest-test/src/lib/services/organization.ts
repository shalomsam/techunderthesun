import { Types } from "mongoose";
import Organization, { IOrganization } from "../../models/Organization";

export const fetchOrgs = () => Organization.find({});

export const fetchOrg = (id: string | Types.ObjectId) =>
  Organization.findById(id);

export const createOrg = ({ name, website }: IOrganization) => {
  const newOrg = new Organization({ name, website });
  return newOrg.save();
};

export const updateOrgById = (
  id: string | Types.ObjectId,
  updates: Partial<IOrganization>
) => Organization.findByIdAndUpdate(id, updates, { new: true }).exec();

export const deleteOrgById = (id: string | Types.ObjectId) =>
  Organization.findByIdAndDelete(id, { new: true }).exec();
