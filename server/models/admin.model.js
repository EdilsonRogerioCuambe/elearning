import { Schema, model } from "mongoose";

const adminSchema = new Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  foto: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  cpf: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
    unique: true,
  },
  dataNascimento: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  endereco: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  telefone: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  sexo: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
}, {
  timestamps: true,
});

export default model('Admin', adminSchema);