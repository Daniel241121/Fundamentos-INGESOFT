const UserRepository = require('../repositories/UserRepository');
const User = require('../models/User');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  // Single Responsibility Principle: Solo gestiona lógica de usuario
  async register(userData) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash de contraseña (Responsibility: seguridad)
      const passwordHash = bcrypt.hashSync(userData.password, 10);

      // Crear nuevo usuario
      const newUser = new User(
        null,
        userData.email,
        passwordHash,
        userData.firstName,
        userData.lastName,
        'BUYER'
      );

      const savedUser = await this.userRepository.save(newUser);
      logger.log(`User registered: ${savedUser.email}`);

      return savedUser.toDTO();
    } catch (error) {
      logger.error('Error registering user', error);
      throw error;
    }
  }

  // Open/Closed Principle: Abierto a extensión (nuevos métodos de auth)
  async login(email, password) {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = user.validatePassword(password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Generar JWT Token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      logger.log(`User logged in: ${user.email}`);
      return { token, user: user.toDTO() };
    } catch (error) {
      logger.error('Error logging in', error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user.toDTO();
    } catch (error) {
      logger.error('Error fetching user', error);
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new Error('User not found');
      }

      user.firstName = userData.firstName || user.firstName;
      user.lastName = userData.lastName || user.lastName;
      user.updatedAt = new Date();

      const updatedUser = await this.userRepository.update(id, user);
      logger.log(`User updated: ${updatedUser.email}`);

      return updatedUser.toDTO();
    } catch (error) {
      logger.error('Error updating user', error);
      throw error;
    }
  }
}

module.exports = UserService;
