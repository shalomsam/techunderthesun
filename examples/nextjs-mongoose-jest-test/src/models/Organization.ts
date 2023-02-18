import { model, models, Schema } from "mongoose";

export type IOrganization = {
  name: string;
  website: string;
};

const OrgSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true },
    website: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Organization =
  models.Organization || model("Organization", OrgSchema);

export default Organization;
