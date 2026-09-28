-- ===================================================
-- GramMitraAI - Seed Data for SIH26074
-- ===================================================
USE grammitraai_db;

-- Roles
INSERT INTO roles (name, description) VALUES
('ROLE_FARMER', 'Standard farmer with field & advisory access'),
('ROLE_OFFICER', 'Agriculture Officer with Panchayat & block analytics'),
('ROLE_ADMIN', 'Platform Administrator & Model Registry Manager')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- Demo User (BCrypt password for 'farmer123': $2a$10$wK1Wk9n3T4/u4J0Uo7b.Re83mC3N5bFwBw0k/2.QGqEwM/9k3Wzvy)
INSERT INTO users (id, full_name, email, mobile_number, password_hash, preferred_language, state, district, block, panchayat)
VALUES 
(1, 'Ramesh Patel', 'ramesh.farmer@grammitra.ai', '9876543210', '$2a$10$7R6v78aU9gE8Pz9k4vIgeOmk1h2T3v4b5n6m7q8w9e0r1t2y3u4i5', 'hi', 'Madhya Pradesh', 'Indore', 'Sanwer', 'Dharampuri'),
(2, 'Dr. Anita Sharma', 'officer.anita@grammitra.ai', '9823456789', '$2a$10$7R6v78aU9gE8Pz9k4vIgeOmk1h2T3v4b5n6m7q8w9e0r1t2y3u4i5', 'en', 'Madhya Pradesh', 'Indore', 'Sanwer', 'Sanwer Central'),
(3, 'Admin System', 'admin@grammitra.ai', '9800000000', '$2a$10$7R6v78aU9gE8Pz9k4vIgeOmk1h2T3v4b5n6m7q8w9e0r1t2y3u4i5', 'en', 'Madhya Pradesh', 'Indore', 'Indore HQ', 'HQ')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

INSERT INTO user_roles (user_id, role_id) VALUES (1, 1), (2, 2), (3, 3)
ON DUPLICATE KEY UPDATE user_id=VALUES(user_id);

-- States & Districts (Covering required test locations: MP, RJ, MH, UP, KL, AS)
INSERT INTO states (id, code, lgd_code, name) VALUES 
(1, 'MP', 23, 'Madhya Pradesh'),
(2, 'MH', 27, 'Maharashtra'),
(3, 'RJ', 8, 'Rajasthan'),
(4, 'UP', 9, 'Uttar Pradesh'),
(5, 'KL', 32, 'Kerala'),
(6, 'AS', 18, 'Assam')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO districts (id, state_id, district_code, lgd_code, name) VALUES 
(1, 1, 'IND', 405, 'Indore'),
(2, 1, 'UJJ', 406, 'Ujjain'),
(3, 2, 'NSK', 512, 'Nashik'),
(4, 2, 'PUN', 513, 'Pune'),
(5, 3, 'JPR', 101, 'Jaipur'),
(6, 4, 'VNS', 198, 'Varanasi'),
(7, 5, 'KTM', 588, 'Kottayam'),
(8, 6, 'KMR', 288, 'Kamrup')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO blocks (id, district_id, block_code, lgd_code, name) VALUES 
(1, 1, 'SAN', 3512, 'Sanwer'),
(2, 1, 'DEP', 3514, 'Depalpur'),
(3, 3, 'NPH', 4890, 'Niphad'),
(4, 4, 'BRM', 4898, 'Baramati'),
(5, 5, 'SNG', 1045, 'Sanganer'),
(6, 6, 'PND', 2110, 'Pindra'),
(7, 7, 'PLM', 6120, 'Pallom'),
(8, 8, 'HAJ', 2410, 'Hajo')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Panchayats with real LGD codes and coordinates
INSERT INTO panchayats (id, block_id, panchayat_code, lgd_code, name, latitude, longitude, elevation_meters, soil_type_primary, ndvi_baseline, distance_to_water_km) VALUES
(1, 1, 'GP-147820', 147820, 'Dharampuri', 22.9734000, 75.8267000, 528.0, 'Deep Black Vertisol', 0.62, 1.2),
(2, 1, 'GP-147825', 147825, 'Ajnod', 22.9450000, 75.8010000, 515.0, 'Medium Black Soil', 0.54, 3.1),
(3, 3, 'GP-168230', 168230, 'Pimpalgaon Baswant', 20.1742000, 73.9856000, 580.0, 'Rich Alluvial Loam', 0.72, 0.9),
(4, 5, 'GP-154210', 154210, 'Watika', 26.7412000, 75.8123000, 385.0, 'Sandy Loam', 0.42, 3.5),
(5, 6, 'GP-178940', 178940, 'Mangari', 25.4821000, 82.8523000, 85.0, 'Gangetic Alluvium Loam', 0.65, 0.6),
(6, 7, 'GP-198240', 198240, 'Kumarakom', 9.6175000, 76.4301000, 3.0, 'Coastal Acid Saline Kari', 0.81, 0.1),
(7, 8, 'GP-204510', 204510, 'Sualkuchi', 26.1664000, 91.5724000, 52.0, 'Brahmaputra Alluvial Loam', 0.77, 0.3)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Villages (The final 5th tier with individual coordinates, soil, NDVI)
INSERT INTO villages (id, panchayat_id, village_code, name, hindi_name, latitude, longitude, elevation_meters, soil_type, ndvi_baseline, distance_to_water_km) VALUES
(1, 1, '485921', 'Dharampuri', 'धरमपुरी', 22.9734000, 75.8267000, 528.0, 'Deep Black Vertisol', 0.620, 1.2),
(2, 1, '485922', 'Kshipra', 'क्षिप्रा', 22.9912000, 75.8645000, 535.0, 'Black Clay Loam', 0.580, 0.4),
(3, 3, '549812', 'Pimpalgaon Baswant', 'पिंपलगांव बसवंत', 20.1742000, 73.9856000, 580.0, 'Rich Alluvial Loam', 0.720, 0.9),
(4, 4, '512301', 'Watika', 'वाटिका', 26.7412000, 75.8123000, 385.0, 'Sandy Loam', 0.420, 3.5),
(5, 5, '602341', 'Mangari', 'मंगारी', 25.4821000, 82.8523000, 85.0, 'Gangetic Alluvium Loam', 0.650, 0.6),
(6, 6, '628105', 'Kumarakom', 'कुमारकोम', 9.6175000, 76.4301000, 3.0, 'Coastal Acid Saline Kari', 0.810, 0.1),
(7, 7, '641205', 'Sualkuchi', 'सुआलकुची', 26.1664000, 91.5724000, 52.0, 'Brahmaputra Alluvial Loam', 0.770, 0.3)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Sample Fields
INSERT INTO fields (id, user_id, panchayat_id, field_name, latitude, longitude, area_acres, crop_name, sowing_date, soil_type, irrigation_type) VALUES
(1, 1, 1, 'Khet 1 - Riverbank North', 22.9741000, 75.8273000, 3.20, 'Wheat', '2025-11-15', 'Black Clay Loam', 'Drip Irrigation'),
(2, 1, 1, 'Khet 2 - East Ridge', 22.9715000, 75.8290000, 4.50, 'Soybean', '2025-06-25', 'Medium Black', 'Sprinkler'),
(3, 1, 2, 'Khet 3 - Kshipra Basin', 22.9920000, 75.8650000, 2.10, 'Gram / Chickpea', '2025-11-20', 'Deep Black Vertisol', 'Flood / Furrow')
ON DUPLICATE KEY UPDATE field_name=VALUES(field_name);

-- Crop Profiles
INSERT INTO crop_profiles (id, crop_name, scientific_name, optimal_temp_min, optimal_temp_max, optimal_humidity_min, optimal_humidity_max, water_requirement_mm_per_week, critical_stages) VALUES
(1, 'Wheat', 'Triticum aestivum', 15.0, 25.0, 40, 70, 35.0, 'CRI (21 DAS), Tillering, Booting, Flowering, Grain filling'),
(2, 'Soybean', 'Glycine max', 20.0, 30.0, 50, 80, 45.0, 'Emergence, Flowering, Pod formation, Pod fill'),
(3, 'Gram / Chickpea', 'Cicer arietinum', 14.0, 24.0, 30, 60, 25.0, 'Pre-flowering, Pod development'),
(4, 'Maize', 'Zea mays', 18.0, 32.0, 45, 75, 50.0, 'Knee high, Tasseling, Silking, Grain fill'),
(5, 'Cotton', 'Gossypium hirsutum', 21.0, 35.0, 40, 75, 40.0, 'Squaring, Flowering, Boll formation')
ON DUPLICATE KEY UPDATE crop_name=VALUES(crop_name);

-- Weather Alerts
INSERT INTO weather_alerts (id, panchayat_id, event_type, severity, headline, description, mitigation_actions, starts_at, expires_at, is_active) VALUES
(1, 1, 'HEAVY_RAINFALL', 'ORANGE_ALERT', 'High Intensity Rain Expected (45-65mm) in next 24h', 'Convective cloud burst pattern moving across Sanwer block. High runoff expected on non-bunded fields.', 'Clear drainage furrows immediately; suspend urea top-dressing; delay spraying fungicide till 36 hours after rain.', NOW(), DATE_ADD(NOW(), INTERVAL 36 HOUR), TRUE)
ON DUPLICATE KEY UPDATE headline=VALUES(headline);

-- ML Model Registry
INSERT INTO ml_model_versions (id, model_name, model_family, version_tag, mae_score, rmse_score, r2_score, training_dataset_size, is_active_production) VALUES
(1, 'Block-to-Panchayat Downscaler', 'XGBoost-Regressor', 'v2.4.1', 0.7241, 1.0532, 0.9420, 185000, TRUE),
(2, 'Hyperlocal Microclimate Estimator', 'RandomForest-Ensemble', 'v1.8.0', 0.8120, 1.1870, 0.9180, 94000, TRUE),
(3, 'Extreme Weather Classifier', 'GradientBoostedTrees', 'v3.0.2', 0.0410, 0.0890, 0.9650, 420000, TRUE)
ON DUPLICATE KEY UPDATE is_active_production=VALUES(is_active_production);
