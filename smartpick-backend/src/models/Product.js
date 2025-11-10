// src/models/Product.js
const { v4: uuidv4 } = require('uuid');

class Product {
  constructor(
    id,
    name,
    description,
    category,
    externalLink,
    createdAt,
    updatedAt
  ) {
    this.id = id || uuidv4();
    this.name = name;
    this.description = description || null;
    this.category = category || null;
    this.externalLink = externalLink || null;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  toDTO() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      externalLink: this.externalLink,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Product;
