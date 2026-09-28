import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';
import bcrypt from 'bcryptjs';

import Trust from '../models/Trust.js';
import Campaign from '../models/Campaign.js';
import Donation from '../models/Donation.js';
import CampaignUpdate from '../models/CampaignUpdate.js';
import Admin from '../models/Admin.js';
import TrustUser from '../models/TrustUser.js';
import { trustsData, campaignsData, mockDonors } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure public DNS resolvers to prevent ECONNREFUSED on MongoDB Atlas SRV queries on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore fallback
}

dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    console.log(`Connecting to MongoDB at: ${connStr}`);
    await mongoose.connect(connStr);

    console.log('Clearing existing database collections...');
    await Trust.deleteMany({});
    await Campaign.deleteMany({});
    await Donation.deleteMany({});
    await CampaignUpdate.deleteMany({});
    await Admin.deleteMany({});
    await TrustUser.deleteMany({});

    console.log('Creating Admin Account...');
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@123', salt);
    const trustDefaultPasswordHash = await bcrypt.hash('Trust@123', salt);

    const admin = await Admin.create({
      name: 'Super Admin',
      email: 'admin@helpinghands.org',
      passwordHash: adminPasswordHash,
      role: 'admin'
    });
    console.log(`✓ Admin created: ${admin.email} (Password: Admin@123)`);

    console.log('Inserting Trusts...');
    const createdTrusts = await Trust.insertMany(trustsData);
    console.log(`✓ Inserted ${createdTrusts.length} Trusts.`);

    console.log('Creating Trust User Accounts...');
    for (const t of createdTrusts) {
      await TrustUser.create({
        trustId: t._id,
        email: t.contact.email,
        passwordHash: trustDefaultPasswordHash,
        authProvider: 'local',
        role: 'trust'
      });
    }
    console.log(`✓ Created ${createdTrusts.length} Trust User Accounts (Default password: Trust@123)`);

    console.log('Inserting Campaigns & Updates...');
    const createdCampaigns = [];

    for (let i = 0; i < campaignsData.length; i++) {
      const campData = campaignsData[i];
      // Assign each campaign to a trust round-robin style
      const assignedTrust = createdTrusts[i % createdTrusts.length];

      const campaign = await Campaign.create({
        ...campData,
        trust: assignedTrust._id,
        shareCount: Math.floor(Math.random() * 25) + 3,
        detailedNeed: `Comprehensive need breakdown for ${campData.title}. Funds directly allocated to verified materials and local operations.`,
        expectedFundsUse: 'Direct beneficiary assistance (85%), Logistics and distribution (10%), Administrative transparency (5%)',
        compliance: {
          gstNumber: '36AAACH1234F1Z5',
          panNumber: 'AAACH1234F',
          eightyGDetails: '80G Registered - 50% Tax Exemption eligible',
          twelveADetails: '12A Income Tax Exemption Certified',
          fcraStatus: 'Compliant with Indian Trust Act'
        }
      });
      createdCampaigns.push(campaign);

      // Create a sample update for campaigns
      if (i % 2 === 0) {
        await CampaignUpdate.create({
          campaign: campaign._id,
          trust: assignedTrust._id,
          title: "Initial Milestone Achieved & Field Distribution Started",
          description: `Our team on the ground has successfully surveyed target beneficiaries in ${assignedTrust.location}. Equipment/supplies procurement is underway thanks to early supporters!`,
          photos: [campaign.image],
          documents: [
            {
              name: "Procurement-Receipt-Batch1.pdf",
              url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
              docType: "pdf"
            }
          ],
          status: 'approved'
        });
      }
    }
    console.log(`✓ Inserted ${createdCampaigns.length} Campaigns.`);

    console.log('Generating 35 Demo Donations...');
    const donationAmounts = [250, 500, 1000, 1500, 2500, 5000, 10000];
    let totalDonationsCount = 0;

    for (let i = 0; i < 35; i++) {
      const donor = mockDonors[i % mockDonors.length];
      const campaign = createdCampaigns[i % createdCampaigns.length];
      const amount = donationAmounts[Math.floor(Math.random() * donationAmounts.length)];
      const isAnonymous = i % 5 === 0;

      await Donation.create({
        campaign: campaign._id,
        trust: campaign.trust,
        donorName: isAnonymous ? 'Anonymous Supporter' : donor.name,
        donorEmail: donor.email,
        donorPhone: donor.phone,
        amount,
        anonymous: isAnonymous,
        paymentStatus: 'Success',
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 20 * 24 * 60 * 60 * 1000))
      });

      totalDonationsCount++;
    }
    console.log(`✓ Inserted ${totalDonationsCount} Demo Donations.`);

    console.log('\n=======================================');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Admin Login: admin@helpinghands.org / Admin@123');
    console.log(`Trust Login: ${createdTrusts[0].contact.email} / Trust@123`);
    console.log('=======================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
