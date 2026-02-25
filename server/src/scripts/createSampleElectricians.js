import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';

const sampleElectricians = [
  {
    name: 'Robert Chen',
    email: 'robert.chen@example.com',
    phone: '+1 234 567 8901',
    password: 'password123',
    role: 'ELECTRICIAN',
    approvalStatus: 'approved',
    specialization: 'Residential Wiring',
    experience: '8 years',
    location: 'New York, NY',
    certifications: ['Licensed Electrician', 'OSHA Certified'],
    totalJobs: 45,
    completedJobs: 42,
    rating: 4.8
  },
  {
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    phone: '+1 234 567 8902',
    password: 'password123',
    role: 'ELECTRICIAN',
    approvalStatus: 'pending',
    specialization: 'Commercial Electrical',
    experience: '5 years',
    location: 'Los Angeles, CA',
    certifications: ['Journeyman Electrician'],
    totalJobs: 0,
    completedJobs: 0,
    rating: 0
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    phone: '+1 234 567 8903',
    password: 'password123',
    role: 'ELECTRICIAN',
    approvalStatus: 'rejected',
    specialization: 'Industrial Electrical',
    experience: '3 years',
    location: 'Chicago, IL',
    certifications: ['Apprentice Electrician'],
    totalJobs: 0,
    completedJobs: 0,
    rating: 0
  },
  {
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    phone: '+1 234 567 8904',
    password: 'password123',
    role: 'ELECTRICIAN',
    approvalStatus: 'pending',
    specialization: 'HVAC Electrical',
    experience: '6 years',
    location: 'Houston, TX',
    certifications: ['HVAC Certified', 'Electrical License'],
    totalJobs: 0,
    completedJobs: 0,
    rating: 0
  },
  {
    name: 'David Kim',
    email: 'david.kim@example.com',
    phone: '+1 234 567 8905',
    password: 'password123',
    role: 'ELECTRICIAN',
    approvalStatus: 'approved',
    specialization: 'Residential Wiring',
    experience: '10 years',
    location: 'Phoenix, AZ',
    certifications: ['Master Electrician', 'Safety Certified'],
    totalJobs: 67,
    completedJobs: 65,
    rating: 4.9
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 234 567 8906',
    password: 'password123',
    role: 'ELECTRICIAN',
    approvalStatus: 'approved',
    specialization: 'Commercial Electrical',
    experience: '7 years',
    location: 'Miami, FL',
    certifications: ['Commercial License', 'OSHA Certified'],
    totalJobs: 34,
    completedJobs: 32,
    rating: 4.6
  },
  {
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '+1 234 567 8907',
    password: 'password123',
    role: 'ELECTRICIAN',
    approvalStatus: 'suspended',
    specialization: 'Industrial Electrical',
    experience: '4 years',
    location: 'Dallas, TX',
    certifications: ['Industrial License'],
    totalJobs: 12,
    completedJobs: 10,
    rating: 3.2
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '+1 234 567 8908',
    password: 'password123',
    role: 'ELECTRICIAN',
    approvalStatus: 'pending',
    specialization: 'Residential Wiring',
    experience: '2 years',
    location: 'Seattle, WA',
    certifications: ['Apprentice Electrician'],
    totalJobs: 0,
    completedJobs: 0,
    rating: 0
  },
  {
    name: 'Thomas Martinez',
    email: 'thomas.martinez@example.com',
    phone: '+1 234 567 8909',
    password: 'password123',
    role: 'ELECTRICIAN',
    approvalStatus: 'approved',
    specialization: 'Emergency Services',
    experience: '12 years',
    location: 'Denver, CO',
    certifications: ['Emergency Services Certified', 'Master Electrician'],
    totalJobs: 89,
    completedJobs: 87,
    rating: 4.7
  },
  {
    name: 'Jennifer Taylor',
    email: 'jennifer.taylor@example.com',
    phone: '+1 234 567 8910',
    password: 'password123',
    role: 'ELECTRICIAN',
    approvalStatus: 'pending',
    specialization: 'Solar Installation',
    experience: '3 years',
    location: 'Portland, OR',
    certifications: ['Solar Installation Certified', 'Electrical License'],
    totalJobs: 0,
    completedJobs: 0,
    rating: 0
  }
];

const createSampleElectricians = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing electricians (optional - comment out if you want to keep existing)
    // await User.deleteMany({ role: 'ELECTRICIAN' });
    // console.log('Cleared existing electricians');

    for (const electrician of sampleElectricians) {
      // Check if electrician already exists
      const existingElectrician = await User.findOne({ email: electrician.email });
      
      if (existingElectrician) {
        console.log(`Electrician ${electrician.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(electrician.password, 10);
      
      // Create electrician
      const newElectrician = new User({
        ...electrician,
        password: hashedPassword
      });

      await newElectrician.save();
      console.log(`Created electrician: ${electrician.name}`);
    }

    console.log('Sample electricians created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample electricians:', error);
    process.exit(1);
  }
};

createSampleElectricians();
