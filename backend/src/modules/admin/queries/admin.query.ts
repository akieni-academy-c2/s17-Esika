const selectAdminByPhoneNumber = `SELECT * FROM admins WHERE phone_number = $1`;

export {selectAdminByPhoneNumber}