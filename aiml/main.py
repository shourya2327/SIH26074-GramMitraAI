"""
GramMitraAI - AI & Machine Learning Microservice
Exposes REST endpoints for Weather Downscaling, Hyperlocal Prediction,
Explainable AI (SHAP), Crop Advisories, Smart Irrigation, and What-If Simulations.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from downscaling.downscaler import WeatherDownscaler
from rainfall.rainfall_model import RainfallPredictor
from crop.crop_advisory_engine import CropAdvisoryEngine
from irrigation.irrigation_optimizer import SmartIrrigationOptimizer
from disease.disease_risk_model import CropDiseaseRiskModel
from extreme_weather.alert_detector import ExtremeWeatherAlertDetector
from explainable_ai.shap_explainer import ShapExplainerEngine
from simulation.what_if_simulator import WhatIfSimulator
from evaluation.metrics_evaluator import ModelMetricsEvaluator
from feedback.retraining_pipeline import ControlledRetrainingPipeline

app = FastAPI(
    title="GramMitraAI - AI/ML Microservice",
    version="1.0.0",
    description="Panchayat-level weather downscaling, crop advisories, and explainable AI service for SIH26074."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate ML Engines
downscaler = WeatherDownscaler()
rainfall_predictor = RainfallPredictor()
advisory_engine = CropAdvisoryEngine()
irrigation_optimizer = SmartIrrigationOptimizer()
disease_model = CropDiseaseRiskModel()
alert_detector = ExtremeWeatherAlertDetector()
shap_explainer = ShapExplainerEngine()
simulator = WhatIfSimulator()
evaluator = ModelMetricsEvaluator()
feedback_pipeline = ControlledRetrainingPipeline()

# Pydantic Schemas
class DownscaleRequest(BaseModel):
    block_temp: float = 31.5
    block_humidity: float = 68.0
    block_rainfall: float = 14.5
    block_wind_speed: float = 12.0
    block_elevation: float = 480.0
    target_elevation: float = 530.0
    target_lat: float = 22.9734
    target_lon: float = 75.8267
    target_ndvi: float = 0.58
    target_soil: str = "Black Clay Loam"
    distance_to_water_km: float = 1.2

class RainfallRequest(BaseModel):
    current_rain_mm: float = 15.0
    humidity: int = 78
    temp: float = 29.5

class AdvisoryRequest(BaseModel):
    crop_name: str = "Wheat"
    growth_stage: str = "Crown Root Initiation"
    temperature: float = 28.5
    rainfall_expected_mm: float = 12.0
    humidity: int = 65
    wind_speed: float = 10.5
    soil_type: str = "Black Soil"

class IrrigationRequest(BaseModel):
    crop_name: str = "Wheat"
    growth_stage_group: str = "Vegetative"
    soil_type: str = "Black Clay Loam"
    area_acres: float = 3.2
    temperature: float = 30.0
    humidity: int = 60
    wind_speed: float = 12.0
    rainfall_expected_mm: float = 10.0

class DiseaseRequest(BaseModel):
    crop_name: str = "Wheat"
    temperature: float = 22.0
    humidity: int = 82
    rainfall_expected_mm: float = 15.0

class AlertRequest(BaseModel):
    temperature: float = 32.0
    rainfall_expected_mm: float = 45.0
    wind_speed_kmh: float = 28.0
    humidity: int = 75

class ExplainRequest(BaseModel):
    rainfall_expected_mm: float = 28.5
    humidity: int = 82
    temperature: float = 27.5
    elevation: float = 535.0
    ndvi: float = 0.62
    distance_to_water_km: float = 1.2

class SimulationRequest(BaseModel):
    base_temp: float = 29.0
    base_rain_mm: float = 15.0
    base_humidity: int = 70
    base_wind: float = 12.0
    delta_temp: float = 2.0
    delta_rain_pct: float = 30.0
    delta_humidity_pct: float = 10.0
    delta_wind_pct: float = 0.0
    crop_name: str = "Wheat"

class FeedbackRequest(BaseModel):
    farmer_id: int = 1
    field_id: int = 1
    is_useful: bool = True
    advisory_type: str = "SMART_IRRIGATION"
    observed_weather_summary: str = "Rain was 20mm, advice to pause irrigation saved water!"
    farmer_comment: str = "Very timely warning."

# Endpoints
@app.get("/")
def root():
    return {
        "service": "GramMitraAI - AI & Machine Learning Service",
        "status": "ONLINE",
        "version": "1.0.0",
        "active_models": ["XGBoost-Ensemble-v2.4", "TreeSHAP-Explainer", "Microclimate-BiasCorrection-v1"]
    }

@app.get("/health")
def health():
    return {"status": "UP"}

@app.post("/api/ai/downscale")
def downscale_weather(req: DownscaleRequest):
    return downscaler.downscale(
        block_temp=req.block_temp,
        block_humidity=req.block_humidity,
        block_rainfall=req.block_rainfall,
        block_wind_speed=req.block_wind_speed,
        block_elevation=req.block_elevation,
        target_elevation=req.target_elevation,
        target_lat=req.target_lat,
        target_lon=req.target_lon,
        target_ndvi=req.target_ndvi,
        target_soil=req.target_soil,
        distance_to_water_km=req.distance_to_water_km
    )

@app.post("/api/ai/rainfall")
def predict_rainfall(req: RainfallRequest):
    return rainfall_predictor.predict_horizons(
        current_rain_mm=req.current_rain_mm,
        humidity=req.humidity,
        temp=req.temp
    )

@app.post("/api/ai/advisory")
def generate_crop_advisory(req: AdvisoryRequest):
    return advisory_engine.generate_advisory(
        crop_name=req.crop_name,
        growth_stage=req.growth_stage,
        temperature=req.temperature,
        rainfall_expected_mm=req.rainfall_expected_mm,
        humidity=req.humidity,
        wind_speed=req.wind_speed,
        soil_type=req.soil_type
    )

@app.post("/api/ai/irrigation")
def optimize_irrigation(req: IrrigationRequest):
    return irrigation_optimizer.calculate_irrigation(
        crop_name=req.crop_name,
        growth_stage_group=req.growth_stage_group,
        soil_type=req.soil_type,
        area_acres=req.area_acres,
        temperature=req.temperature,
        humidity=req.humidity,
        wind_speed=req.wind_speed,
        rainfall_expected_mm=req.rainfall_expected_mm
    )

@app.post("/api/ai/disease-risk")
def calculate_disease_risk(req: DiseaseRequest):
    return disease_model.evaluate_risk(
        crop_name=req.crop_name,
        temperature=req.temperature,
        humidity=req.humidity,
        rainfall_expected_mm=req.rainfall_expected_mm
    )

@app.post("/api/ai/alerts")
def detect_weather_alerts(req: AlertRequest):
    alerts = alert_detector.detect_alerts(
        temperature=req.temperature,
        rainfall_expected_mm=req.rainfall_expected_mm,
        wind_speed_kmh=req.wind_speed_kmh,
        humidity=req.humidity
    )
    return {"alerts": alerts, "count": len(alerts)}

@app.post("/api/ai/explain")
def explain_predictions(req: ExplainRequest):
    return shap_explainer.explain_rainfall_prediction(
        rainfall_expected_mm=req.rainfall_expected_mm,
        humidity=req.humidity,
        temperature=req.temperature,
        elevation=req.elevation,
        ndvi=req.ndvi,
        distance_to_water_km=req.distance_to_water_km
    )

@app.post("/api/simulator/what-if")
def simulate_scenario(req: SimulationRequest):
    return simulator.simulate_scenario(
        base_temp=req.base_temp,
        base_rain_mm=req.base_rain_mm,
        base_humidity=req.base_humidity,
        base_wind=req.base_wind,
        delta_temp=req.delta_temp,
        delta_rain_pct=req.delta_rain_pct,
        delta_humidity_pct=req.delta_humidity_pct,
        delta_wind_pct=req.delta_wind_pct,
        crop_name=req.crop_name
    )

@app.post("/api/feedback")
def submit_feedback(req: FeedbackRequest):
    import uuid
    fb_id = f"FB-{uuid.uuid4().hex[:8].upper()}"
    return feedback_pipeline.record_farmer_feedback(
        feedback_id=fb_id,
        farmer_id=req.farmer_id,
        field_id=req.field_id,
        is_useful=req.is_useful,
        advisory_type=req.advisory_type,
        observed_weather_summary=req.observed_weather_summary,
        farmer_comment=req.farmer_comment
    )

@app.get("/api/feedback/pipeline-status")
def get_feedback_pipeline_status():
    return feedback_pipeline.get_pipeline_status()

@app.get("/api/analysis/forecast-vs-actual")
def get_forecast_vs_actual():
    # Return 14-day sample evaluation data with MAE / RMSE / R²
    historical_points = [
        {"date": "2026-09-12", "temp_pred": 30.2, "temp_act": 29.8, "rain_pred": 12.0, "rain_act": 14.5},
        {"date": "2026-09-13", "temp_pred": 31.0, "temp_act": 30.4, "rain_pred": 25.0, "rain_act": 22.0},
        {"date": "2026-09-14", "temp_pred": 29.5, "temp_act": 29.1, "rain_pred": 8.0, "rain_act": 6.5},
        {"date": "2026-09-15", "temp_pred": 28.0, "temp_act": 28.5, "rain_pred": 40.0, "rain_act": 44.0},
        {"date": "2026-09-16", "temp_pred": 27.2, "temp_act": 27.0, "rain_pred": 18.0, "rain_act": 19.5},
        {"date": "2026-09-17", "temp_pred": 28.8, "temp_act": 29.2, "rain_pred": 5.0, "rain_act": 4.0},
        {"date": "2026-09-18", "temp_pred": 30.5, "temp_act": 31.1, "rain_pred": 0.0, "rain_act": 0.0},
        {"date": "2026-09-19", "temp_pred": 32.0, "temp_act": 31.4, "rain_pred": 0.0, "rain_act": 0.0},
        {"date": "2026-09-20", "temp_pred": 31.5, "temp_act": 32.0, "rain_pred": 2.0, "rain_act": 0.0},
        {"date": "2026-09-21", "temp_pred": 29.8, "temp_act": 29.5, "rain_pred": 15.0, "rain_act": 13.8},
        {"date": "2026-09-22", "temp_pred": 28.5, "temp_act": 28.2, "rain_pred": 30.0, "rain_act": 32.5},
        {"date": "2026-09-23", "temp_pred": 29.0, "temp_act": 29.4, "rain_pred": 12.0, "rain_act": 10.0},
        {"date": "2026-09-24", "temp_pred": 30.1, "temp_act": 29.9, "rain_pred": 4.0, "rain_act": 3.0},
        {"date": "2026-09-25", "temp_pred": 30.8, "temp_act": 31.2, "rain_pred": 0.0, "rain_act": 0.0}
    ]
    metrics = evaluator.calculate_metrics(historical_points)
    return {
        "metrics": metrics,
        "daily_comparison": historical_points
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
