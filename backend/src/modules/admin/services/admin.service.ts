import pool from "../../../config/database.ts";
import { selectAdminByPhoneNumber } from "../queries/admin.query.ts";
import type { LoginData } from "../../../types/login.type.ts";
import AppError from "../../../utils/app-error.ts";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
const isBcryptHash = (value: string) => value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$");
const loginAdmin = async ({ phoneNumber, password }: LoginData) => {
  const results = await pool.query(selectAdminByPhoneNumber, [phoneNumber]);
  const admin = results.rows[0];
  if (!admin) throw new AppError(404, "Numéro de téléphone inexistant");
  const passwordIsValid = isBcryptHash(admin.password) ? await bcrypt.compare(password, admin.password) : password === admin.password;
  if (!passwordIsValid) throw new AppError(400, "Mot de passe incorrect");
  const token = jwt.sign({ userId: admin.admin_id, role: "admin" }, process.env.JWT_SECRET_KEY!, { expiresIn: "1h" });
  return { token, user: { id: admin.admin_id, firstName: admin.first_name ?? "Admin", lastName: admin.last_name ?? "ESIKA", phoneNumber: admin.phone_number } };
};
export { loginAdmin };
