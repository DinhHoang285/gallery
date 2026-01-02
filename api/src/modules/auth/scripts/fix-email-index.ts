/**
 * Script để fix unique index trên email field
 * Chạy script này nếu gặp lỗi "Email đã được sử dụng" khi không có user trong database
 *
 * Cách chạy:
 * 1. Mở MongoDB shell: mongosh
 * 2. use photograph (hoặc database name của bạn)
 * 3. db.users.getIndexes() - xem các indexes
 * 4. db.users.dropIndex("email_1") - xóa index cũ nếu cần
 * 5. db.users.createIndex({ email: 1 }, { unique: true }) - tạo lại index
 */

import { connect, connection } from 'mongoose';

async function fixEmailIndex() {
  try {
    const dbUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/gallery';
    await connect(dbUrl);

    const db = connection.db;
    if (!db) {
      return
    }
    const collection = db.collection('users');

    console.log('📋 Current indexes:');
    const indexes = await collection.indexes();
    console.log(indexes);

    // Kiểm tra xem có index nào trên email không
    const emailIndex = indexes.find(idx => idx.key?.email);
    if (emailIndex) {
      console.log('✅ Email index exists:', emailIndex);
    } else {
      console.log('⚠️  No email index found');
    }

    // Kiểm tra duplicate emails
    const duplicates = await collection.aggregate([
      { $group: { _id: '$email', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]).toArray();

    if (duplicates.length > 0) {
      console.log('⚠️  Found duplicate emails:', duplicates);
    } else {
      console.log('✅ No duplicate emails found');
    }

    await connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Uncomment để chạy
// fixEmailIndex();

