"""
Improved Synthetic Data Generator for Solar Panel Fault Detection
Creates realistic, physically-grounded synthetic data with distinct patterns for each fault type.
"""

import numpy as np
import pandas as pd
from typing import Tuple

class ImprovedSolarDataGenerator:
    """Generate high-quality synthetic solar panel data with realistic fault patterns."""
    
    def __init__(self, n_samples: int = 5000, random_state: int = 42):
        self.n_samples = n_samples
        self.random_state = random_state
        np.random.seed(random_state)
        
        # Fault types
        self.fault_types = [
            'NORMAL',
            'PARTIAL_SHADING',
            'PANEL_DEGRADATION',
            'INVERTER_FAULT',
            'DUST_ACCUMULATION'
        ]
        
    def add_noise(self, data: np.ndarray, noise_level: float = 0.02) -> np.ndarray:
        """Add Gaussian noise to simulate real-world sensor variations."""
        noise = np.random.normal(0, noise_level, data.shape)
        return data * (1 + noise)
    
    def generate_normal(self, n: int) -> pd.DataFrame:
        """Generate NORMAL operating condition data."""
        voltage = np.random.uniform(35, 40, n)
        current = np.random.uniform(7, 9, n)
        temperature = np.random.uniform(25, 35, n)
        irradiance = np.random.uniform(750, 1000, n)
        power = voltage * current  # Realistic power calculation
        
        # Add noise
        voltage = self.add_noise(voltage, 0.015)
        current = self.add_noise(current, 0.015)
        temperature = self.add_noise(temperature, 0.02)
        irradiance = self.add_noise(irradiance, 0.02)
        power = self.add_noise(power, 0.02)
        
        return pd.DataFrame({
            'voltage': voltage,
            'current': current,
            'temperature': temperature,
            'irradiance': irradiance,
            'power': power,
            'fault_type': 'NORMAL'
        })
    
    def generate_partial_shading(self, n: int) -> pd.DataFrame:
        """Generate PARTIAL_SHADING fault data."""
        # Shading causes significant irradiance and current drop
        voltage = np.random.uniform(30, 36, n)  # Slightly reduced
        current = np.random.uniform(4, 6.5, n)  # Significant drop
        temperature = np.random.uniform(22, 32, n)  # Cooler due to less light
        irradiance = np.random.uniform(300, 650, n)  # Major drop
        power = voltage * current * 0.85  # Reduced efficiency
        
        # Add noise
        voltage = self.add_noise(voltage, 0.02)
        current = self.add_noise(current, 0.025)
        temperature = self.add_noise(temperature, 0.02)
        irradiance = self.add_noise(irradiance, 0.03)
        power = self.add_noise(power, 0.03)
        
        return pd.DataFrame({
            'voltage': voltage,
            'current': current,
            'temperature': temperature,
            'irradiance': irradiance,
            'power': power,
            'fault_type': 'PARTIAL_SHADING'
        })
    
    def generate_panel_degradation(self, n: int) -> pd.DataFrame:
        """Generate PANEL_DEGRADATION fault data."""
        # Degradation: high irradiance but low power output
        voltage = np.random.uniform(28, 35, n)  # Gradual voltage drop
        current = np.random.uniform(5.5, 7.5, n)  # Moderate current
        temperature = np.random.uniform(35, 50, n)  # High temperature
        irradiance = np.random.uniform(800, 1000, n)  # High irradiance
        power = voltage * current * 0.70  # Significantly reduced efficiency
        
        # Add noise
        voltage = self.add_noise(voltage, 0.025)
        current = self.add_noise(current, 0.02)
        temperature = self.add_noise(temperature, 0.025)
        irradiance = self.add_noise(irradiance, 0.02)
        power = self.add_noise(power, 0.03)
        
        return pd.DataFrame({
            'voltage': voltage,
            'current': current,
            'temperature': temperature,
            'irradiance': irradiance,
            'power': power,
            'fault_type': 'PANEL_DEGRADATION'
        })
    
    def generate_inverter_fault(self, n: int) -> pd.DataFrame:
        """Generate INVERTER_FAULT data."""
        # Inverter fault: very low voltage/current despite good conditions
        voltage = np.random.uniform(10, 25, n)  # Very low voltage
        current = np.random.uniform(1, 4, n)  # Very low current
        temperature = np.random.uniform(28, 40, n)  # Normal to high
        irradiance = np.random.uniform(750, 1000, n)  # High irradiance
        power = voltage * current * 0.50  # Extremely low power
        
        # Add noise
        voltage = self.add_noise(voltage, 0.03)
        current = self.add_noise(current, 0.035)
        temperature = self.add_noise(temperature, 0.02)
        irradiance = self.add_noise(irradiance, 0.02)
        power = self.add_noise(power, 0.04)
        
        return pd.DataFrame({
            'voltage': voltage,
            'current': current,
            'temperature': temperature,
            'irradiance': irradiance,
            'power': power,
            'fault_type': 'INVERTER_FAULT'
        })
    
    def generate_dust_accumulation(self, n: int) -> pd.DataFrame:
        """Generate DUST_ACCUMULATION fault data."""
        # Dust: normal irradiance but reduced efficiency
        voltage = np.random.uniform(32, 38, n)  # Slightly reduced
        current = np.random.uniform(6, 8, n)  # Slightly reduced
        temperature = np.random.uniform(30, 40, n)  # Slightly elevated
        irradiance = np.random.uniform(700, 950, n)  # Normal irradiance
        power = voltage * current * 0.80  # Reduced efficiency
        
        # Add noise
        voltage = self.add_noise(voltage, 0.02)
        current = self.add_noise(current, 0.02)
        temperature = self.add_noise(temperature, 0.025)
        irradiance = self.add_noise(irradiance, 0.02)
        power = self.add_noise(power, 0.025)
        
        return pd.DataFrame({
            'voltage': voltage,
            'current': current,
            'temperature': temperature,
            'irradiance': irradiance,
            'power': power,
            'fault_type': 'DUST_ACCUMULATION'
        })
    
    def generate_dataset(self) -> pd.DataFrame:
        """Generate balanced dataset with all fault types."""
        samples_per_class = self.n_samples // len(self.fault_types)
        
        print(f"Generating {self.n_samples} samples ({samples_per_class} per class)...")
        
        # Generate data for each fault type
        normal_data = self.generate_normal(samples_per_class)
        shading_data = self.generate_partial_shading(samples_per_class)
        degradation_data = self.generate_panel_degradation(samples_per_class)
        inverter_data = self.generate_inverter_fault(samples_per_class)
        dust_data = self.generate_dust_accumulation(samples_per_class)
        
        # Combine all data
        df = pd.concat([
            normal_data,
            shading_data,
            degradation_data,
            inverter_data,
            dust_data
        ], ignore_index=True)
        
        # Shuffle the dataset
        df = df.sample(frac=1, random_state=self.random_state).reset_index(drop=True)
        
        print(f"✓ Generated {len(df)} samples")
        print(f"✓ Class distribution:\n{df['fault_type'].value_counts()}")
        
        return df


if __name__ == "__main__":
    # Generate improved dataset
    generator = ImprovedSolarDataGenerator(n_samples=5000, random_state=42)
    df = generator.generate_dataset()
    
    # Save to CSV
    output_path = 'data/improved_solar_data.csv'
    df.to_csv(output_path, index=False)
    print(f"\n✓ Dataset saved to {output_path}")
    
    # Display statistics
    print("\n" + "="*60)
    print("DATASET STATISTICS")
    print("="*60)
    print(df.describe())
    print("\n" + "="*60)
    print("CLASS DISTRIBUTION")
    print("="*60)
    print(df['fault_type'].value_counts())
