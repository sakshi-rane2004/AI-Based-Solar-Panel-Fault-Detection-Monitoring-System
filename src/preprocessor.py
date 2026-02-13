"""
Data preprocessing module for solar panel fault detection.
"""
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from typing import Tuple, Optional
import joblib

class SolarDataPreprocessor:
    """Preprocess solar panel sensor data for machine learning."""
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.feature_columns = ['voltage', 'current', 'temperature', 'irradiance', 'power']
        self.target_column = 'fault_type'
        
    def load_data(self, filepath: str) -> pd.DataFrame:
        """Load data from CSV file."""
        try:
            df = pd.read_csv(filepath)
            print(f"Loaded {len(df)} samples from {filepath}")
            return df
        except FileNotFoundError:
            raise FileNotFoundError(f"Data file not found: {filepath}")
    
    def clean_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean and validate the dataset."""
        print("Cleaning data...")
        
        # Check for missing values
        missing_values = df.isnull().sum()
        if missing_values.any():
            print(f"Missing values found:\n{missing_values}")
            df = df.dropna()
            print(f"Dropped rows with missing values. Remaining samples: {len(df)}")
        
        # Remove outliers using IQR method for numerical features
        for column in self.feature_columns:
            Q1 = df[column].quantile(0.25)
            Q3 = df[column].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            
            outliers = (df[column] < lower_bound) | (df[column] > upper_bound)
            outlier_count = outliers.sum()
            
            if outlier_count > 0:
                print(f"Removing {outlier_count} outliers from {column}")
                df = df[~outliers]
        
        print(f"Final dataset size after cleaning: {len(df)}")
        return df
    
    def prepare_features_and_target(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
        """Separate features and target variable."""
        X = df[self.feature_columns].copy()
        y = df[self.target_column].copy()
        
        print(f"Features shape: {X.shape}")
        print(f"Target distribution:\n{y.value_counts()}")
        
        return X, y
    
    def scale_features(self, X_train: pd.DataFrame, X_test: Optional[pd.DataFrame] = None) -> Tuple[np.ndarray, Optional[np.ndarray]]:
        """Scale features using StandardScaler."""
        print("Scaling features...")
        
        X_train_scaled = self.scaler.fit_transform(X_train)
        
        if X_test is not None:
            X_test_scaled = self.scaler.transform(X_test)
            return X_train_scaled, X_test_scaled
        
        return X_train_scaled, None
    
    def encode_labels(self, y_train: pd.Series, y_test: Optional[pd.Series] = None) -> Tuple[np.ndarray, Optional[np.ndarray]]:
        """Encode categorical labels to numerical values."""
        print("Encoding labels...")
        
        y_train_encoded = self.label_encoder.fit_transform(y_train)
        
        print(f"Label mapping: {dict(zip(self.label_encoder.classes_, range(len(self.label_encoder.classes_))))}")
        
        if y_test is not None:
            y_test_encoded = self.label_encoder.transform(y_test)
            return y_train_encoded, y_test_encoded
        
        return y_train_encoded, None
    
    def split_data(self, X: pd.DataFrame, y: pd.Series, 
                   test_size: float = 0.2, random_state: int = 42) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
        """Split data into training and testing sets."""
        print(f"Splitting data with test_size={test_size}")
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=y
        )
        
        print(f"Training set size: {len(X_train)}")
        print(f"Test set size: {len(X_test)}")
        
        return X_train, X_test, y_train, y_test
    
    def preprocess_pipeline(self, filepath: str, test_size: float = 0.2, 
                          random_state: int = 42) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        """Complete preprocessing pipeline."""
        print("Starting preprocessing pipeline...")
        
        # Load and clean data
        df = self.load_data(filepath)
        df_clean = self.clean_data(df)
        
        # Prepare features and target
        X, y = self.prepare_features_and_target(df_clean)
        
        # Split data
        X_train, X_test, y_train, y_test = self.split_data(X, y, test_size, random_state)
        
        # Scale features
        X_train_scaled, X_test_scaled = self.scale_features(X_train, X_test)
        
        # Encode labels
        y_train_encoded, y_test_encoded = self.encode_labels(y_train, y_test)
        
        print("Preprocessing completed successfully!")
        
        return X_train_scaled, X_test_scaled, y_train_encoded, y_test_encoded
    
    def save_preprocessors(self, filepath_prefix: str = 'models/preprocessors'):
        """Save fitted preprocessors for later use."""
        joblib.dump(self.scaler, f'{filepath_prefix}_scaler.pkl')
        joblib.dump(self.label_encoder, f'{filepath_prefix}_label_encoder.pkl')
        print(f"Preprocessors saved with prefix: {filepath_prefix}")
    
    def load_preprocessors(self, filepath_prefix: str = 'models/preprocessors'):
        """Load fitted preprocessors."""
        self.scaler = joblib.load(f'{filepath_prefix}_scaler.pkl')
        self.label_encoder = joblib.load(f'{filepath_prefix}_label_encoder.pkl')
        print(f"Preprocessors loaded from prefix: {filepath_prefix}")
    
    def preprocess_single_sample(self, sample: dict) -> np.ndarray:
        """Preprocess a single sample for prediction."""
        # Convert to DataFrame
        df_sample = pd.DataFrame([sample])
        
        # Ensure all required features are present
        for feature in self.feature_columns:
            if feature not in df_sample.columns:
                raise ValueError(f"Missing feature: {feature}")
        
        # Select and order features
        X_sample = df_sample[self.feature_columns]
        
        # Scale features
        X_sample_scaled = self.scaler.transform(X_sample)
        
        return X_sample_scaled