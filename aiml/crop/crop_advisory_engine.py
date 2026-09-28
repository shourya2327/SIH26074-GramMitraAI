"""
GramMitraAI - Crop-Specific Advisory Engine
Generates scientifically backed, actionable agronomic advice based on crop type,
growth stage, soil condition, and 72-hour forecast dynamics.
"""

from typing import Dict, Any

class CropAdvisoryEngine:
    CROP_KNOWLEDGE_BASE = {
        "Wheat": {
            "critical_stages": ["Crown Root Initiation (21 DAS)", "Tillering", "Late Jointing", "Flowering", "Dough Stage"],
            "optimal_temp": (15.0, 24.0),
            "rain_sensitivity": "High at flowering & harvest",
            "heat_sensitivity": "Terminal heat during grain fill"
        },
        "Soybean": {
            "critical_stages": ["Germination", "Vegetative V3", "Flowering R1", "Pod Formation R3", "Seed Fill R5"],
            "optimal_temp": (20.0, 30.0),
            "rain_sensitivity": "Susceptible to waterlogging in vegetative stage",
            "heat_sensitivity": "Pod dropping above 35°C"
        },
        "Gram / Chickpea": {
            "critical_stages": ["Branching", "Pre-flowering", "Pod development"],
            "optimal_temp": (14.0, 25.0),
            "rain_sensitivity": "Rain during flowering damages pollen viability",
            "heat_sensitivity": "Moderate"
        },
        "Maize": {
            "critical_stages": ["Knee-high", "Tasseling", "Silking", "Grain fill"],
            "optimal_temp": (18.0, 32.0),
            "rain_sensitivity": "Requires consistent moisture during silking",
            "heat_sensitivity": "High pollen sterility above 37°C"
        },
        "Cotton": {
            "critical_stages": ["Square formation", "Flowering", "Boll development"],
            "optimal_temp": (22.0, 35.0),
            "rain_sensitivity": "Continuous wet canopy invites boll rot & sucking pests",
            "heat_sensitivity": "Tolerant up to 38°C"
        }
    }

    def generate_advisory(
        self,
        crop_name: str,
        growth_stage: str,
        temperature: float,
        rainfall_expected_mm: float,
        humidity: int,
        wind_speed: float,
        soil_type: str = "Black Soil"
    ) -> Dict[str, Any]:
        crop = crop_name if crop_name in self.CROP_KNOWLEDGE_BASE else "Wheat"
        kb = self.CROP_KNOWLEDGE_BASE[crop]

        advisories = []
        action_type = "GENERAL"
        urgency = "LOW"

        # 1. Rainfall / Waterlogging checks
        if rainfall_expected_mm > 20.0:
            urgency = "HIGH"
            action_type = "DRAINAGE"
            advisories.append(f"Heavy rainfall of ~{rainfall_expected_mm} mm expected within 24-48 hours. Ensure field drainage channels (waterways) are cleared to avoid stagnant water on root zones.")
            advisories.append("POSTPONE all chemical spraying and nitrogen top-dressing until showers recede.")
        elif rainfall_expected_mm > 5.0:
            urgency = "MEDIUM"
            action_type = "IRRIGATION"
            advisories.append(f"Light showers ({rainfall_expected_mm} mm) predicted. Suspend planned irrigation for the next 2 days to conserve groundwater and power.")
        else:
            if humidity < 40 and temperature > 28.0:
                urgency = "MEDIUM"
                action_type = "IRRIGATION"
                advisories.append(f"Dry air ({humidity}%) and elevated daytime temp ({temperature}°C). Soil moisture depletion is accelerating. Schedule a light irrigation.")

        # 2. Temperature stress checks
        opt_min, opt_max = kb["optimal_temp"]
        if temperature > opt_max + 4.0:
            urgency = "HIGH"
            advisories.append(f"Thermal alert: Ambient temp ({temperature}°C) is above the ideal threshold ({opt_max}°C) for {crop}. Apply light mulching or potassium spray (1% KNO3) to mitigate heat stress during {growth_stage}.")
        elif temperature < opt_min - 4.0:
            advisories.append(f"Night cold dip detected ({temperature}°C). Watch for frost or growth stunting; light evening irrigation helps buffer soil temperature.")

        # 3. Wind speed check
        if wind_speed > 25.0:
            advisories.append(f"Gusty winds ({wind_speed} km/h) forecasted. Avoid tall crop foliar spraying and brace trellised/tall canopies against lodging.")

        if not advisories:
            advisories.append(f"Current weather conditions ({temperature}°C, {humidity}% RH) are favorable for {crop} at {growth_stage}. Standard farm operations can proceed normally.")

        # Hindi translation summary
        hi_advisory = "वर्षा की संभावना के अनुसार खेत में जल निकास सुनिश्चित करें तथा आगामी 2 दिनों तक अतिरिक्त सिंचाई न करें।" if rainfall_expected_mm > 10 else f"वर्तमान मौसम {crop} की फसल ({growth_stage}) के लिए सामान्य है। आवश्यकतानुसार हल्की सिंचाई कर सकते हैं।"

        return {
            "crop": crop,
            "growth_stage": growth_stage,
            "urgency": urgency,
            "action_type": action_type,
            "primary_advisory": advisories[0],
            "additional_actions": advisories[1:],
            "hindi_summary": hi_advisory,
            "disclaimer": "Agricultural recommendations are AI-guided decision support based on weather modeling. Confirm with local Krishi Vigyan Kendra (KVK) guidelines."
        }
