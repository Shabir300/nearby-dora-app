
-- 1. Reset the table (Clear all old/duplicate data)
TRUNCATE TABLE programs RESTART IDENTITY;

-- 2. Insert Verified Locations (30 Exact Records)
INSERT INTO programs (name, venue, address, lat, lng, contact, google_maps_link, timing, category, organizer)
VALUES
('Misrial Road', 'Dewan-e-Khas Marriage Hall', 'near Misrial Road, Rawalpindi Cantt', 33.5970, 73.0039, '+923005077164', 'https://maps.app.goo.gl/1iERmCkWCojMCfYJ6', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Tench Bhata', 'Al-Huda Masjid', 'Street No. 24-A, Peoples Colony, Tench Bhata, Rawalpindi', 33.5843, 73.0213, '+923335151916', 'https://maps.app.goo.gl/WeaXVroL6knF4E1b8', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Chakri Road', 'Al-Buraq Marquee', 'Bani Stop, Khayaban-e-Shifa, Shadman Town, Chakri Road, Rawalpindi', 33.5583, 73.0135, '+923185349518', 'https://maps.app.goo.gl/Nhk7fta6RWyj3RPW7', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Morgah', 'The Venue Marquee', 'Kotha Kalan, Morgah, Rawalpindi', 33.5492, 73.0655, '+923215159579', 'https://maps.app.goo.gl/qGscXQyXbwj1MQ7y7', '08:00 PM', 'Religious', 'Dora Quran Team'),
('DHA Phase 2', 'Avalon Marquee', 'G.T. Road, Opposite DHA 2 (Gate No. 3), Rawalpindi', 33.5206, 73.1525, '+923215852714', 'https://maps.app.goo.gl/jpNRWMDiK96ku1FXA', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Gulraiz', 'Revelation Marquee', 'High Court Road, Gulraiz Gate 2, Rawalpindi', 33.5666, 73.1036, '+923458507198', 'https://maps.app.goo.gl/ALbothbcbgAfLbYY8', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Bahria Town Phase 7', 'Majesty Marquee', 'Bahria Phase 7, near Allah Chowk, Bahria Town', 33.5179, 73.1106, '+923344221060', 'https://maps.app.goo.gl/rZjD3WLrdC6W4kU2A', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Rawal Road', 'Capri Marquee', 'Rawal Road, Rawalpindi', 33.6107, 73.0818, '+923005158417', 'https://maps.app.goo.gl/8stAPKNGmvfGS6YP8', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Gulzar-e-Quaid', 'Jamia Masjid Haramain Sharifain', 'Gulzar-e-Quaid, Rawalpindi', 33.5994, 73.1286, '+923465070646', 'https://maps.app.goo.gl/SNCkgvT6tLeGnNgA6', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Old Airport Road', 'Mir Jan Shadi Hall', 'Dhoke Hafiz, Old Airport Road, Rawalpindi', 33.6078, 73.1112, '+923333004729', 'https://maps.app.goo.gl/H1FW8Ag71DSwiab9A', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Airport Housing Society', 'Kashmir Plaza', 'Sector 4, Airport Housing Society (AECHS), Rawalpindi', 33.5871, 73.1192, '+923005585435', 'https://maps.app.goo.gl/nEhycXVh8QZAAp5DA', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Saidpur Road', 'Royal Mansion', 'Saidpur Road, Haidri Chowk, Rawalpindi', 33.6392, 73.0629, '+923008550773', 'https://maps.app.goo.gl/6F3GfxLaWJbZs8MA7', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Khanna Road', 'Raj Wedding Hall', 'Khanna Road, Rawalpindi', 33.6283, 73.1021, '+923335758239', 'https://maps.app.goo.gl/wGDNHQbT3omkUE9s9', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Wah Cantt', 'Royal Palace Banquet Hall', 'New City, G.T. Road, Wah Cantt', 33.7541, 72.7545, '+923455612409', 'https://maps.app.goo.gl/sQvzhCtkdBKK3jDg9', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Aabpara', 'Regalia Hotel', 'Street 48, G-6/1, near New Aabpara', 33.708963, 73.0832179, '+923335120812', 'https://maps.app.goo.gl/T88PshamKFinq5VP9', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Ghauri Town', 'Grand Oasis Marquee', 'near Petrol Pump, Service Road, Phase 2, Ghauri Town', 33.6194685, 73.1233313, '+923148925873', 'https://maps.app.goo.gl/ZnQb6xiYy6RRLMP57', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Jinnah Garden', 'Wasna Event Complex', 'Block E, Jinnah Garden, near Naval Anchorage', 33.5657175, 73.1650561, '+923273777117', 'https://maps.app.goo.gl/VBT9byCVoiXooycv9', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Park Road', 'Adam Lodge', 'Chatta Bakhtawar, Park Road', 33.6604918, 73.1547225, '+923005114500', 'https://maps.app.goo.gl/V4Tk5Rc3PSkAcsKY8', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Bhara Kahu', 'Milan Marriage Hall', 'Main Murree Road, Bhara Kahu', 33.7445345, 73.1884745, '+923145835458', 'https://maps.app.goo.gl/txitD3JnTdSwWr958', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Model Town Humak', 'Chaudhry Marriage Hall', 'Nai Abadi, Model Town Humak', 33.6511478, 72.9772924, '+923139856449', 'https://maps.app.goo.gl/gwh42zVFv6YYK4tT8', '08:00 PM', 'Religious', 'Dora Quran Team'),
('I-10/3', 'Basement Masjid Hall', 'Kick Start, Plot No. 189, I-10/3', 33.6500889, 73.0412641, '+923355333095', 'https://maps.app.goo.gl/hVxxPVqnWi9JLRB26', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Pakistan Town', 'Community Hub', 'Ground Floor, Silk Center, Street 18, Phase 2, Pakistan Town', 33.564416, 73.1415468, '+923112111193', 'https://maps.app.goo.gl/Yg5YGKBBzpmwqGzh9', '08:00 PM', 'Religious', 'Dora Quran Team'),
('F-11/3', 'Jabal-e-Noor Mosque', 'Hilal Road, Sector F-11/3', 33.6892667, 72.9837253, '+923344328173', 'https://maps.app.goo.gl/G37fY32mc8BPRwq67', '08:00 PM', 'Religious', 'Dora Quran Team'),
('E-11/2', 'Jamia Masjid Qurtuba', 'Khalid Bin Waleed Road, Street No. 76, Sector E-11/2', 33.7017028, 72.9716702, '+923014733804', 'https://maps.app.goo.gl/bKfqtmXiVEW3HZHi6', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Pehont', 'Quran Complex', 'Pehont', 33.6781384, 73.3052454, '+923455511341', 'https://maps.app.goo.gl/s8unJ28p3o3v7D4G6', '08:00 PM', 'Religious', 'Dora Quran Team'),
('G-13', 'Rayyan Marquee', 'East Service Road, G-13', 33.6505471, 72.9750115, '+923458562055', 'https://maps.app.goo.gl/WmWQGH34qiBfoKs79', '08:00 PM', 'Religious', 'Dora Quran Team'),
('G-11/2', 'Jamia Masjid Al-Huda', 'Street No. 39, Sector G-11/2', 33.6688397, 72.9891289, '+923321311222', 'https://maps.app.goo.gl/5RoZ5ouyAfQKrhai7', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Lehtrar Road', 'Ghulam Rabbani Qureshi Welfare Trust', 'and Kidney Center', 33.5875152, 73.3839848, '+923005018029', 'https://maps.app.goo.gl/34MnsZPZU6HESjLL6', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Murree', 'Masjid Sirat-ul-Jannah', 'Company Bagh, Murree', 33.6329664, 73.1243615, '+923455992634', 'https://maps.app.goo.gl/C1iAdftKRQLiFkrw8', '08:00 PM', 'Religious', 'Dora Quran Team'),
('Mansehra Road', 'Madani Jamia Masjid', 'Irrigation Jab Pul (Bridge), Mansehra Road', 34.1838125, 73.2306875, '+923335057120', 'https://maps.app.goo.gl/YrcbFWNBBzrvRhKj9', '08:00 PM', 'Religious', 'Dora Quran Team');
