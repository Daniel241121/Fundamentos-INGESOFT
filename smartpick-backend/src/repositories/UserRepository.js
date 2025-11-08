// src/repositories/UserRepository.js
const supabase = require('../../db');
const User = require('../models/User');
const logger = require('../utils/logger');

class UserRepository {
  constructor() {
    // ya no usamos DatabaseConnection, todo va con supabase
  }

  async findById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return this._mapToUser(data);
    } catch (error) {
      logger.error('Error finding user by ID', error);
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return this._mapToUser(data);
    } catch (error) {
      logger.error('Error finding user by email', error);
      throw error;
    }
  }

  async findByRole(role) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', role);

      if (error) throw error;

      return data.map(row => this._mapToUser(row));
    } catch (error) {
      logger.error('Error finding users by role', error);
      throw error;
    }
  }

  async save(user) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          password_hash: user.passwordHash,
          first_name: user.firstName,
          last_name: user.lastName,
          role: user.role,
          is_active: user.isActive,
          created_at: user.createdAt,
          updated_at: user.updatedAt
        })
        .select()
        .single();

      if (error) throw error;

      return this._mapToUser(data);
    } catch (error) {
      logger.error('Error saving user', error);
      throw error;
    }
  }

  async update(id, user) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          role: user.role,
          is_active: user.isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) return null;

      return this._mapToUser(data);
    } catch (error) {
      logger.error('Error updating user', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Error deleting user', error);
      throw error;
    }
  }

  _mapToUser(row) {
    return new User(
      row.id,
      row.email,
      row.password_hash,
      row.first_name,
      row.last_name,
      row.role,
      row.is_active,
      row.created_at,
      row.updated_at
    );
  }
}

module.exports = UserRepository;
