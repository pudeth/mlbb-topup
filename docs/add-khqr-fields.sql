-- Add KHQR fields to Payments table
-- Run this if you're using SQLite and migrations don't work

-- SQLite version
ALTER TABLE Payments ADD COLUMN KHQRBillNumber TEXT NULL;
ALTER TABLE Payments ADD COLUMN KHQRMd5Hash TEXT NULL;
ALTER TABLE Payments ADD COLUMN KHQRQRCode TEXT NULL;
ALTER TABLE Payments ADD COLUMN KHQRDeeplink TEXT NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS IX_Payments_KHQRMd5Hash ON Payments(KHQRMd5Hash);
CREATE INDEX IF NOT EXISTS IX_Payments_KHQRBillNumber ON Payments(KHQRBillNumber);

-- Verify the changes
SELECT sql FROM sqlite_master WHERE type='table' AND name='Payments';
