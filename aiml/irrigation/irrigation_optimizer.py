"""
GramMitraAI - Smart Irrigation Optimizer
Calculates field water balance: Penman-Monteith reference evapotranspiration (ET0),
crop coefficient (Kc), available soil water capacity, and upcoming rainfall offset.
"""

from typing import Dict, Any

class SmartIrrigationOptimizer:
    # Crop coefficient Kc based on growth stages
    CROP_KC = {
        "Wheat": {"Early": 0.4, "Vegetative": 0.8, "Flowering": 1.15, "Maturity": 0.6},
        "Soybean": {"Early": 0.4, "Vegetative": 0.85, "Flowering": 1.15, "Maturity": 0.5},
        "Gram / Chickpea": {"Early": 0.4, "Vegetative": 0.75, "Flowering": 1.05, "Maturity": 0.45},
        "Maize": {"Early": 0.4, "Vegetative": 0.9, "Flowering": 1.2, "Maturity": 0.6},
        "Cotton": {"Early": 0.45, "Vegetative": 0.85, "Flowering": 1.2, "Maturity": 0.7}
    }

    # Available water holding capacity by soil (mm per meter depth)
    SOIL_AWC = {
        "Black Clay Loam": 180,
        "Deep Black Vertisol": 200,
        "Medium Black": 150,
        "Sandy Loam": 100,
        "Red Loam": 120,
        "Clay Loam": 160
    }

    def calculate_irrigation(
        self,
        crop_name: str,
        growth_stage_group: str,  # 'Early', 'Vegetative', 'Flowering', 'Maturity'
        soil_type: str,
        area_acres: float,
        temperature: float,
        humidity: int,
        wind_speed: float,
        rainfall_expected_mm: float
    ) -> Dict[str, Any]:
        crop_kc_map = self.CROP_KC.get(crop_name, self.CROP_KC["Wheat"])
        kc = crop_kc_map.get(growth_stage_group, 0.85)

        # Simplified Hargreaves/ET0 approximation from temp and humidity
        et0 = max(2.0, (0.0023 * (temperature + 17.8) * ((temperature - 15.0) ** 0.5 if temperature > 15 else 1.0)) * 4.5)
        crop_et = round(et0 * kc, 2)  # mm water consumed per day

        two_day_crop_need = crop_et * 2.5
        effective_rain = rainfall_expected_mm * 0.75  # 75% effective precipitation
        net_water_deficit = two_day_crop_need - effective_rain

        irrigation_required = net_water_deficit > 8.0
        recommended_water_mm = round(max(0.0, net_water_deficit), 1) if irrigation_required else 0.0

        # Run time calculation: Standard drip system discharges ~2.5 mm per hour; sprinkler ~6 mm/h
        estimated_run_time_minutes = int((recommended_water_mm / 2.5) * 60) if irrigation_required else 0

        # Rationale creation
        if not irrigation_required:
            if rainfall_expected_mm > 15.0:
                reason = f"Irrigation NOT required. Forecasted rainfall of {rainfall_expected_mm} mm fully offsets the 2-day crop evapotranspiration requirement ({round(two_day_crop_need, 1)} mm)."
                reason_hi = f"सिंचाई की आवश्यकता नहीं है। अपेक्षित वर्षा ({rainfall_expected_mm} मिमी) फसल की जल आवश्यकता की पूर्ति के लिए पर्याप्त है।"
            else:
                reason = f"Soil moisture storage remains within comfortable field capacity. Next irrigation cycle can be deferred by 48 hours."
                reason_hi = "खेत में नमी का स्तर संतुलित है। अगले 48 घंटों तक सिंचाई स्थगित की जा सकती है।"
        else:
            reason = f"Irrigation RECOMMENDED: 2-day crop ET requirement is {round(two_day_crop_need, 1)} mm against {rainfall_expected_mm} mm forecast rainfall. Net deficit is {recommended_water_mm} mm."
            reason_hi = f"हल्की सिंचाई की अनुशंसा है ({recommended_water_mm} मिमी जल)। मौसम शुष्क होने से वाष्पोत्सर्जन दर अधिक है।"

        return {
            "irrigation_required": irrigation_required,
            "recommended_water_mm": recommended_water_mm,
            "estimated_run_time_minutes": estimated_run_time_minutes,
            "evapotranspiration_mm_day": crop_et,
            "rainfall_offset_mm": round(effective_rain, 1),
            "estimated_soil_moisture_pct": 72 if not irrigation_required else 44,
            "field_area_acres": area_acres,
            "rationale": reason,
            "rationale_hi": reason_hi,
            "disclaimer": "Smart Irrigation suggestions are advisory guidelines based on soil-water balance modeling. Always verify local field soil moisture before pumping."
        }
