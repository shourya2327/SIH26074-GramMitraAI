"""
GramMitraAI - What-If Weather Simulator
Allows farmers and agricultural scientists to simulate alternative microclimate scenarios
(e.g., "What if rainfall increases by 30%?", "What if temp jumps by +3°C?").
Crucial: Explicitly labeled as simulated scenarios, not real forecasts!
"""

from typing import Dict, Any

class WhatIfSimulator:
    def simulate_scenario(
        self,
        base_temp: float,
        base_rain_mm: float,
        base_humidity: int,
        base_wind: float,
        delta_temp: float,          # e.g. +3.0 or -2.0
        delta_rain_pct: float,      # e.g. +30% or -50%
        delta_humidity_pct: float,  # e.g. +10% or -15%
        delta_wind_pct: float,      # e.g. +20%
        crop_name: str = "Wheat"
    ) -> Dict[str, Any]:
        # Calculate simulated parameters
        sim_temp = round(base_temp + delta_temp, 1)
        sim_rain = round(max(0.0, base_rain_mm * (1.0 + (delta_rain_pct / 100.0))), 1)
        sim_humidity = min(100, max(10, int(base_humidity + delta_humidity_pct)))
        sim_wind = round(max(0.0, base_wind * (1.0 + (delta_wind_pct / 100.0))), 1)

        # Dynamic simulation consequences
        # 1. Irrigation status
        if sim_rain > 12.0:
            sim_irrigation_needed = False
            irrigation_rationale = f"Simulated {sim_rain} mm rain eliminates irrigation requirement for 4-5 days."
        elif sim_temp > 33.0 and sim_rain < 2.0:
            sim_irrigation_needed = True
            irrigation_rationale = f"Elevated temperature ({sim_temp}°C) and low rainfall requires urgent {round(18 + (sim_temp - 30)*2, 1)} mm irrigation."
        else:
            sim_irrigation_needed = (base_rain_mm < 5.0)
            irrigation_rationale = f"Standard irrigation schedule maintained under simulated parameters."

        # 2. Disease risk simulation
        if sim_humidity > 80 and 16 <= sim_temp <= 25 and sim_rain > 10:
            sim_disease_risk = "HIGH"
            disease_detail = "Elevated humidity and damp foliage create severe fungal spore multiplication conditions."
        elif sim_humidity > 70:
            sim_disease_risk = "MEDIUM"
            disease_detail = "Moderate humidity. Regular scouting recommended."
        else:
            sim_disease_risk = "LOW"
            disease_detail = "Low moisture limits foliar pathogen development."

        # 3. Weather hazard risk
        if sim_rain > 50.0:
            weather_risk = "HIGH - Waterlogging & Runoff Risk"
        elif sim_temp > 40.0:
            weather_risk = "HIGH - Heat Stress & Pollen Desiccation"
        elif sim_wind > 35.0:
            weather_risk = "MODERATE - Crop Lodging & Wind Drift"
        else:
            weather_risk = "LOW - Normal Operational Envelope"

        # Advisory for simulated conditions
        sim_advisory = (
            f"SIMULATED SCENARIO RESULT: Under {sim_temp}°C temp, {sim_rain} mm rain, and {sim_humidity}% RH, "
            f"irrigation need is {'REQUIRED' if sim_irrigation_needed else 'NOT REQUIRED'}. "
            f"Disease risk is evaluated as {sim_disease_risk}."
        )

        return {
            "simulation_id": "SIM-RUN-ACTIVE",
            "is_simulation_flag": True,
            "disclaimer": "SIMULATION ONLY: This is a mathematical hypothetical scenario designed for farm planning and risk analysis. It does NOT represent the actual real-world weather forecast.",
            "inputs": {
                "base_temperature": base_temp,
                "base_rainfall_mm": base_rain_mm,
                "base_humidity": base_humidity,
                "delta_temp": delta_temp,
                "delta_rain_pct": delta_rain_pct,
                "delta_humidity_pct": delta_humidity_pct,
                "delta_wind_pct": delta_wind_pct,
                "crop": crop_name
            },
            "simulated_conditions": {
                "temperature": sim_temp,
                "rainfall_mm": sim_rain,
                "humidity": sim_humidity,
                "wind_speed_kmh": sim_wind
            },
            "impact_assessment": {
                "irrigation_needed": sim_irrigation_needed,
                "irrigation_rationale": irrigation_rationale,
                "disease_risk": sim_disease_risk,
                "disease_detail": disease_detail,
                "weather_hazard_risk": weather_risk,
                "advisory_summary": sim_advisory
            }
        }
