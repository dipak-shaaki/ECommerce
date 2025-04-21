import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorName: {
    type: String,
    required: [true, 'Please provide doctor name'],
  },
  doctorLicense: {
    type: String,
    required: [true, 'Please provide doctor license number'],
  },
  patientName: {
    type: String,
    required: [true, 'Please provide patient name'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide prescription date'],
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please provide prescription expiry date'],
  },
  image: {
    type: String,
    required: [true, 'Please upload prescription image'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  medicines: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    quantity: Number,
  }],
  notes: String,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  verificationDate: Date,
  rejectionReason: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Prescription || mongoose.model('Prescription', prescriptionSchema); 