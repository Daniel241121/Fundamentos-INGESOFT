const { v4: uuidv4 } = require('uuid');

class User {
  constructor(id, email, passwordHash, firstName, lastName, role, isActive, createdAt, updatedAt) {
    this.id = id || uuidv4();
    this.email = email;
    this.passwordHash = passwordHash;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role || 'BUYER';
    this.isActive = isActive !== undefined ? isActive : true;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  validatePassword(pwd) {
    const bcrypt = require('bcryptjs');
    return bcrypt.compareSync(pwd, this.passwordHash);
  }

  isAdmin() {
    return this.role === 'ADMIN';
  }

  toDTO() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
    };
  }
}

module.exports = User;
