-- ===================================================
-- GramMitraAI - SIH26074 Database Schema (MySQL 8.0)
-- AI-Powered Panchayat-Level Weather & Smart Farming Platform
-- ===================================================

CREATE DATABASE IF NOT EXISTS grammitraai_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE grammitraai_db;

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    mobile_number VARCHAR(20) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    preferred_language VARCHAR(20) DEFAULT 'hi',
    state VARCHAR(100),
    district VARCHAR(100),
    block VARCHAR(100),
    panchayat VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. USER ROLES JUNCTION
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 4. ADMINISTRATIVE BOUNDARIES (State -> District -> Block -> Panchayat -> Village)
CREATE TABLE IF NOT EXISTS states (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    lgd_code INT UNIQUE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS districts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    state_id BIGINT NOT NULL,
    district_code VARCHAR(20),
    lgd_code INT,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (state_id) REFERENCES states(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS blocks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    district_id BIGINT NOT NULL,
    block_code VARCHAR(20),
    lgd_code INT,
    name VARCHAR(100) NOT NULL,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS panchayats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    block_id BIGINT NOT NULL,
    panchayat_code VARCHAR(30),
    lgd_code INT,
    name VARCHAR(120) NOT NULL,
    latitude DECIMAL(10, 7) DEFAULT NULL,
    longitude DECIMAL(10, 7) DEFAULT NULL,
    elevation_meters DECIMAL(8, 2) DEFAULT NULL,
    soil_type_primary VARCHAR(60) DEFAULT NULL,
    ndvi_baseline DECIMAL(4, 3) DEFAULT NULL,
    distance_to_water_km DECIMAL(6, 2) DEFAULT NULL,
    FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
    INDEX idx_panchayat_coords (latitude, longitude)
);

CREATE TABLE IF NOT EXISTS villages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    panchayat_id BIGINT NOT NULL,
    village_code VARCHAR(50) UNIQUE,
    name VARCHAR(120) NOT NULL,
    hindi_name VARCHAR(120),
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    elevation_meters DECIMAL(8, 2) DEFAULT NULL,
    soil_type VARCHAR(60) DEFAULT NULL,
    ndvi_baseline DECIMAL(4, 3) DEFAULT NULL,
    distance_to_water_km DECIMAL(6, 2) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (panchayat_id) REFERENCES panchayats(id) ON DELETE CASCADE,
    INDEX idx_village_coords (latitude, longitude),
    INDEX idx_village_code (village_code)
);

-- 5. FARMER FIELDS
CREATE TABLE IF NOT EXISTS fields (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    panchayat_id BIGINT NULL,
    village_id BIGINT NULL,
    field_name VARCHAR(120) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    area_acres DECIMAL(8, 2) NOT NULL DEFAULT 1.0,
    crop_name VARCHAR(80),
    sowing_date DATE,
    soil_type VARCHAR(60),
    irrigation_type VARCHAR(60),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (panchayat_id) REFERENCES panchayats(id) ON DELETE SET NULL,
    INDEX idx_field_coords (latitude, longitude)
);

CREATE TABLE IF NOT EXISTS field_boundaries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    field_id BIGINT NOT NULL,
    point_order INT NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- 6. WEATHER DATA (OBSERVED & CURRENT)
CREATE TABLE IF NOT EXISTS weather_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    panchayat_id BIGINT NULL,
    field_id BIGINT NULL,
    recorded_at TIMESTAMP NOT NULL,
    temperature DECIMAL(5, 2) NOT NULL,
    feels_like DECIMAL(5, 2),
    humidity INT NOT NULL,
    rainfall_mm DECIMAL(7, 2) DEFAULT 0.0,
    wind_speed_kmh DECIMAL(5, 2),
    wind_direction_deg INT,
    pressure_hpa DECIMAL(6, 2),
    cloud_cover_pct INT,
    uv_index DECIMAL(4, 2),
    rain_probability INT,
    data_source VARCHAR(50) DEFAULT 'STATION_SENSOR',
    FOREIGN KEY (panchayat_id) REFERENCES panchayats(id) ON DELETE SET NULL,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE SET NULL,
    INDEX idx_weather_time (recorded_at)
);

-- 7. WEATHER FORECASTS (BLOCK & PANCHAYAT LEVEL)
CREATE TABLE IF NOT EXISTS weather_forecasts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    panchayat_id BIGINT NOT NULL,
    forecast_type ENUM('HOURLY', 'DAILY') NOT NULL,
    forecast_time TIMESTAMP NOT NULL,
    temperature DECIMAL(5, 2) NOT NULL,
    temp_min DECIMAL(5, 2),
    temp_max DECIMAL(5, 2),
    humidity INT NOT NULL,
    rainfall_expected_mm DECIMAL(7, 2) DEFAULT 0.0,
    rainfall_probability_pct INT DEFAULT 0,
    wind_speed_kmh DECIMAL(5, 2),
    wind_direction VARCHAR(10),
    weather_condition VARCHAR(80),
    icon_code VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (panchayat_id) REFERENCES panchayats(id) ON DELETE CASCADE,
    INDEX idx_forecast_lookup (panchayat_id, forecast_time)
);

-- 8. AI/ML HYPERLOCAL & DOWNSCALED PREDICTIONS
CREATE TABLE IF NOT EXISTS hyperlocal_predictions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    field_id BIGINT NULL,
    panchayat_id BIGINT NULL,
    prediction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source_block_temp DECIMAL(5, 2),
    downscaled_temp DECIMAL(5, 2),
    downscaled_humidity INT,
    downscaled_rain_prob INT,
    downscaled_rain_mm DECIMAL(7, 2),
    elevation_factor DECIMAL(5, 3),
    ndvi_factor DECIMAL(5, 3),
    terrain_factor DECIMAL(5, 3),
    model_version VARCHAR(50) DEFAULT 'XGBoost-Ensemble-v2.1',
    confidence_score DECIMAL(5, 2),
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE SET NULL,
    FOREIGN KEY (panchayat_id) REFERENCES panchayats(id) ON DELETE SET NULL
);

-- 9. RAINFALL & MICROCLIMATE PREDICTIONS
CREATE TABLE IF NOT EXISTS rainfall_predictions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    panchayat_id BIGINT NOT NULL,
    prediction_date DATE NOT NULL,
    timeframe ENUM('TODAY', 'TOMORROW', 'DAY_3', 'DAY_7') NOT NULL,
    expected_rain_min_mm DECIMAL(6, 2),
    expected_rain_max_mm DECIMAL(6, 2),
    rain_probability_pct INT,
    intensity_category ENUM('NO_RAIN', 'LIGHT', 'MODERATE', 'HEAVY', 'VERY_HEAVY'),
    risk_level ENUM('LOW', 'MODERATE', 'HIGH', 'SEVERE'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (panchayat_id) REFERENCES panchayats(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS microclimate_predictions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    field_id BIGINT NOT NULL,
    prediction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    panchayat_avg_temp DECIMAL(5, 2),
    field_micro_temp DECIMAL(5, 2),
    temp_delta DECIMAL(4, 2),
    panchayat_avg_humidity INT,
    field_micro_humidity INT,
    vegetation_index DECIMAL(4, 3),
    canopy_effect_score DECIMAL(4, 2),
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- 10. CROP PROFILES & ADVISORIES
CREATE TABLE IF NOT EXISTS crop_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    crop_name VARCHAR(80) NOT NULL UNIQUE,
    scientific_name VARCHAR(120),
    optimal_temp_min DECIMAL(4, 1),
    optimal_temp_max DECIMAL(4, 1),
    optimal_humidity_min INT,
    optimal_humidity_max INT,
    water_requirement_mm_per_week DECIMAL(6, 2),
    critical_stages VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS crop_advisories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    field_id BIGINT NULL,
    crop_name VARCHAR(80) NOT NULL,
    growth_stage VARCHAR(60),
    advisory_text TEXT NOT NULL,
    advisory_text_hi TEXT,
    action_type ENUM('IRRIGATION', 'FERTILIZER', 'PEST_CONTROL', 'HARVEST', 'DRAINAGE', 'GENERAL'),
    urgency_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- 11. SMART IRRIGATION ADVISORIES
CREATE TABLE IF NOT EXISTS irrigation_advisories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    field_id BIGINT NOT NULL,
    irrigation_required BOOLEAN NOT NULL,
    recommended_water_mm DECIMAL(6, 2) DEFAULT 0.0,
    estimated_run_time_minutes INT DEFAULT 0,
    rainfall_offset_mm DECIMAL(6, 2) DEFAULT 0.0,
    soil_moisture_estimated_pct INT,
    rationale TEXT NOT NULL,
    rationale_hi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- 12. CROP DISEASE RISKS
CREATE TABLE IF NOT EXISTS disease_risks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    field_id BIGINT NULL,
    crop_name VARCHAR(80) NOT NULL,
    disease_name VARCHAR(120) NOT NULL,
    risk_level ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL,
    pathogen_type VARCHAR(60) DEFAULT 'FUNGAL',
    favorable_conditions TEXT,
    recommended_action TEXT,
    recommended_action_hi TEXT,
    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- 13. WEATHER ALERTS (EXTREME WARNINGS)
CREATE TABLE IF NOT EXISTS weather_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    panchayat_id BIGINT NULL,
    district_id BIGINT NULL,
    event_type ENUM('HEAVY_RAINFALL', 'HEATWAVE', 'COLD_WAVE', 'STRONG_WIND', 'HAILSTORM', 'FLOOD_RISK', 'LIGHTNING'),
    severity ENUM('YELLOW_WATCH', 'ORANGE_ALERT', 'RED_WARNING') NOT NULL,
    headline VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    mitigation_actions TEXT,
    starts_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (panchayat_id) REFERENCES panchayats(id) ON DELETE SET NULL,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE SET NULL
);

-- 14. EXPLAINABLE AI & CONFIDENCE SCORES
CREATE TABLE IF NOT EXISTS confidence_scores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prediction_type ENUM('DOWNSCALING', 'RAINFALL', 'DISEASE', 'IRRIGATION'),
    reference_id BIGINT NOT NULL,
    model_name VARCHAR(80) NOT NULL,
    confidence_pct DECIMAL(5, 2) NOT NULL,
    confidence_label ENUM('VERY_LOW', 'LOW', 'MODERATE', 'HIGH', 'VERY_HIGH'),
    shap_top_features JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. SIMULATION LOGS (WHAT-IF SCENARIOS)
CREATE TABLE IF NOT EXISTS simulations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    field_id BIGINT NULL,
    crop_name VARCHAR(80),
    temp_delta DECIMAL(4, 2),
    rainfall_delta_pct INT,
    humidity_delta_pct INT,
    wind_delta_pct INT,
    simulated_disease_risk VARCHAR(50),
    simulated_irrigation_needed BOOLEAN,
    simulated_weather_risk VARCHAR(50),
    simulated_advisory TEXT,
    simulated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 16. FORECAST VS ACTUAL METRICS
CREATE TABLE IF NOT EXISTS forecast_actual (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    panchayat_id BIGINT NOT NULL,
    observation_date DATE NOT NULL,
    temp_forecast DECIMAL(5, 2),
    temp_actual DECIMAL(5, 2),
    temp_abs_error DECIMAL(5, 2),
    rain_forecast_mm DECIMAL(6, 2),
    rain_actual_mm DECIMAL(6, 2),
    rain_abs_error DECIMAL(6, 2),
    humidity_forecast INT,
    humidity_actual INT,
    FOREIGN KEY (panchayat_id) REFERENCES panchayats(id) ON DELETE CASCADE,
    INDEX idx_obs_date (observation_date)
);

-- 17. FARMER FEEDBACK & SELF-LEARNING
CREATE TABLE IF NOT EXISTS feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    field_id BIGINT NULL,
    advisory_id BIGINT NULL,
    is_useful BOOLEAN NOT NULL,
    farmer_comment TEXT,
    actual_weather_observed VARCHAR(150),
    crop_condition_reported VARCHAR(150),
    flagged_for_retraining BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 18. NOTIFICATIONS & VOICE ADVISORIES
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    channel ENUM('IN_APP', 'SMS', 'VOICE', 'PUSH', 'EMAIL') DEFAULT 'IN_APP',
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS voice_advisories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    field_id BIGINT NULL,
    language_code VARCHAR(10) NOT NULL,
    audio_transcript TEXT NOT NULL,
    audio_file_url VARCHAR(255),
    duration_seconds INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 19. ML MODEL REGISTRY & VERSIONS
CREATE TABLE IF NOT EXISTS ml_model_versions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    model_family VARCHAR(50) NOT NULL,
    version_tag VARCHAR(30) NOT NULL,
    mae_score DECIMAL(6, 4),
    rmse_score DECIMAL(6, 4),
    r2_score DECIMAL(6, 4),
    training_dataset_size INT,
    is_active_production BOOLEAN DEFAULT FALSE,
    deployed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
