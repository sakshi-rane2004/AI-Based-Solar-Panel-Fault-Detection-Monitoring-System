"""
Synthetic dataset generator for solar panel fault detection.
"""
import pandas as pd
import numpy as np
from typing import Tuple

class SolarDataGenerator:
    """Generate synthetic solar panel sensor data with fault labels."""
    
    def __init__(self, random_state: int = 42):
        self.random_state = random_state
        np.random.seed(random_state)
        
    def generate_dataset(self, n_samples: int = 10000) -> pd.DataFrame:
        """
        Generate synthetic solar panel dataset with fault types.
        
        Args:
            n_samples: Number of samples to generate
            
        Returns:
            DataFrame with features and fault_type labels
        """
        data = []
        
        # Define fault type distribution
        fault_types = ['NORMAL', 'PARTIAL_SHADING', 'PANEL_DEGRADATION', 
                      'INVERTER_FAULT', 'DUST_ACCUMULATION']
        fault_weights = [0.6, 0.15, 0.1, 0.1, 0.05]  # Normal operation is most common
        
        for _ in range(n_samples):
            fault_type = np.random.choice(fault_types, p=fault_weights)
            sample = self._generate_sample_by_fault_type(fault_type)
            data.append(sample)
            
        df = pd.DataFrame(data)
        return df
    
    def _generate_sample_by_fault_type(self, fault_type: str) -> dict:
        """Generate a single sample based on fault type."""
        
        if fault_type == 'NORMAL':
            return self._generate_normal_sample()
        elif fault_type == 'PARTIAL_SHADING':
            return self._generate_partial_shading_sample()
        elif fault_type == 'PANEL_DEGRADATION':
            return self._generate_panel_degradation_sample()
        elif fault_type == 'INVERTER_FAULT':
            return self._generate_inverter_fault_sample()
        elif fault_type == 'DUST_ACCUMULATION':
            return self._generate_dust_accumulation_sample()
    
    def _generate_normal_sample(self) -> dict:
        """Generate normal operating conditions."""
        irradiance = np.random.normal(800, 200)  # W/m²
        irradiance = max(100, min(1200, irradiance))
        
        temperature = np.random.normal(25, 10)  # °C
        temperature = max(-10, min(60, temperature))
        
        # Normal voltage and current based on irradiance
        voltage = np.random.normal(30 + irradiance * 0.01, 2)
        current = np.random.normal(8 + irradiance * 0.005, 1)
        power = voltage * current
        
        return {
            'voltage': round(voltage, 2),
            'current': round(current, 2),
            'temperature': round(temperature, 1),
            'irradiance': round(irradiance, 1),
            'power': round(power, 2),
            'fault_type': 'NORMAL'
        }
    
    def _generate_partial_shading_sample(self) -> dict:
        """Generate partial shading conditions - reduced current."""
        irradiance = np.random.normal(600, 150)  # Reduced irradiance
        irradiance = max(50, min(900, irradiance))
        
        temperature = np.random.normal(25, 10)
        temperature = max(-10, min(60, temperature))
        
        voltage = np.random.normal(28 + irradiance * 0.008, 3)  # Slightly lower voltage
        current = np.random.normal(4 + irradiance * 0.003, 1)  # Significantly reduced current
        power = voltage * current
        
        return {
            'voltage': round(voltage, 2),
            'current': round(current, 2),
            'temperature': round(temperature, 1),
            'irradiance': round(irradiance, 1),
            'power': round(power, 2),
            'fault_type': 'PARTIAL_SHADING'
        }
    
    def _generate_panel_degradation_sample(self) -> dict:
        """Generate panel degradation conditions - overall reduced performance."""
        irradiance = np.random.normal(800, 200)
        irradiance = max(100, min(1200, irradiance))
        
        temperature = np.random.normal(30, 12)  # Slightly higher temperature
        temperature = max(-10, min(60, temperature))
        
        # Degraded performance - 15-25% reduction
        degradation_factor = np.random.uniform(0.75, 0.85)
        voltage = np.random.normal((30 + irradiance * 0.01) * degradation_factor, 2)
        current = np.random.normal((8 + irradiance * 0.005) * degradation_factor, 1)
        power = voltage * current
        
        return {
            'voltage': round(voltage, 2),
            'current': round(current, 2),
            'temperature': round(temperature, 1),
            'irradiance': round(irradiance, 1),
            'power': round(power, 2),
            'fault_type': 'PANEL_DEGRADATION'
        }
    
    def _generate_inverter_fault_sample(self) -> dict:
        """Generate inverter fault conditions - voltage irregularities."""
        irradiance = np.random.normal(800, 200)
        irradiance = max(100, min(1200, irradiance))
        
        temperature = np.random.normal(35, 15)  # Higher temperature due to fault
        temperature = max(-10, min(70, temperature))
        
        # Voltage fluctuations and irregularities
        voltage = np.random.normal(25 + irradiance * 0.008, 5)  # More variance, lower average
        current = np.random.normal(7 + irradiance * 0.004, 2)  # More variance
        power = voltage * current
        
        return {
            'voltage': round(voltage, 2),
            'current': round(current, 2),
            'temperature': round(temperature, 1),
            'irradiance': round(irradiance, 1),
            'power': round(power, 2),
            'fault_type': 'INVERTER_FAULT'
        }
    
    def _generate_dust_accumulation_sample(self) -> dict:
        """Generate dust accumulation conditions - reduced irradiance effect."""
        irradiance = np.random.normal(700, 180)  # Slightly reduced
        irradiance = max(80, min(1000, irradiance))
        
        temperature = np.random.normal(28, 12)
        temperature = max(-10, min(60, temperature))
        
        # Dust reduces effective irradiance by 10-20%
        effective_irradiance = irradiance * np.random.uniform(0.8, 0.9)
        voltage = np.random.normal(29 + effective_irradiance * 0.009, 2)
        current = np.random.normal(7 + effective_irradiance * 0.004, 1)
        power = voltage * current
        
        return {
            'voltage': round(voltage, 2),
            'current': round(current, 2),
            'temperature': round(temperature, 1),
            'irradiance': round(irradiance, 1),
            'power': round(power, 2),
            'fault_type': 'DUST_ACCUMULATION'
        }

def generate_and_save_dataset(filename: str = 'data/solar_panel_data.csv', 
                            n_samples: int = 10000) -> None:
    """Generate and save synthetic dataset to CSV file."""
    generator = SolarDataGenerator()
    df = generator.generate_dataset(n_samples)
    df.to_csv(filename, index=False)
    print(f"Dataset with {len(df)} samples saved to {filename}")
    print(f"Fault type distribution:")
    print(df['fault_type'].value_counts())

if __name__ == "__main__":
    generate_and_save_dataset()