"""
Research-Grade Solar Panel Fault Detection Model Training
Includes feature engineering, hyperparameter tuning, and comprehensive evaluation.
"""

import numpy as np
import pandas as pd
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    classification_report, confusion_matrix
)
import warnings
warnings.filterwarnings('ignore')

# Set style for plots
sns.set_style('whitegrid')
plt.rcParams['figure.figsize'] = (12, 8)


class ImprovedSolarFaultDetector:
    """Research-grade solar panel fault detection model."""
    
    def __init__(self, random_state=42):
        self.random_state = random_state
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.feature_names = None
        self.best_params = None
        
    def engineer_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Create derived features for better fault detection."""
        df = df.copy()
        
        # Efficiency: power output relative to irradiance
        df['efficiency'] = df['power'] / (df['irradiance'] + 1e-6)
        
        # Voltage-Current ratio
        df['voltage_current_ratio'] = df['voltage'] / (df['current'] + 1e-6)
        
        # Power-Voltage ratio
        df['power_voltage_ratio'] = df['power'] / (df['voltage'] + 1e-6)
        
        # Temperature effect on performance
        df['temperature_effect'] = df['temperature'] / (df['irradiance'] + 1e-6)
        
        # Power density
        df['power_density'] = df['power'] / (df['voltage'] * df['current'] + 1e-6)
        
        print(f"✓ Engineered {5} new features")
        return df
    
    def prepare_data(self, df: pd.DataFrame):
        """Prepare data with feature engineering and preprocessing."""
        print("\n" + "="*60)
        print("DATA PREPARATION")
        print("="*60)
        
        # Engineer features
        df = self.engineer_features(df)
        
        # Separate features and target
        X = df.drop('fault_type', axis=1)
        y = df['fault_type']
        
        self.feature_names = X.columns.tolist()
        print(f"✓ Total features: {len(self.feature_names)}")
        print(f"  Original: voltage, current, temperature, irradiance, power")
        print(f"  Engineered: efficiency, voltage_current_ratio, power_voltage_ratio,")
        print(f"              temperature_effect, power_density")
        
        # Encode labels
        y_encoded = self.label_encoder.fit_transform(y)
        print(f"✓ Encoded {len(self.label_encoder.classes_)} classes")
        
        # Train-test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y_encoded, test_size=0.2, random_state=self.random_state, stratify=y_encoded
        )
        print(f"✓ Train set: {len(X_train)} samples")
        print(f"✓ Test set: {len(X_test)} samples")
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        print(f"✓ Features scaled using StandardScaler")
        
        return X_train_scaled, X_test_scaled, y_train, y_test
    
    def tune_hyperparameters(self, X_train, y_train):
        """Perform grid search for optimal hyperparameters."""
        print("\n" + "="*60)
        print("HYPERPARAMETER TUNING")
        print("="*60)
        
        param_grid = {
            'n_estimators': [100, 200, 300],
            'max_depth': [10, 20, 30, None],
            'min_samples_split': [2, 5, 10],
            'min_samples_leaf': [1, 2, 4],
            'max_features': ['sqrt', 'log2']
        }
        
        print(f"Grid search with {len(param_grid)} parameters...")
        print(f"Total combinations: {3*4*3*3*2} = 216")
        
        rf = RandomForestClassifier(random_state=self.random_state, n_jobs=-1)
        
        grid_search = GridSearchCV(
            rf, param_grid, cv=5, scoring='f1_weighted',
            verbose=1, n_jobs=-1
        )
        
        print("Running 5-fold cross-validation...")
        grid_search.fit(X_train, y_train)
        
        self.best_params = grid_search.best_params_
        self.model = grid_search.best_estimator_
        
        print(f"\n✓ Best parameters found:")
        for param, value in self.best_params.items():
            print(f"  {param}: {value}")
        print(f"✓ Best CV F1-score: {grid_search.best_score_:.4f}")
        
        return self.model
    
    def evaluate_model(self, X_test, y_test):
        """Comprehensive model evaluation."""
        print("\n" + "="*60)
        print("MODEL EVALUATION")
        print("="*60)
        
        y_pred = self.model.predict(X_test)
        
        # Calculate metrics
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, average='weighted')
        recall = recall_score(y_test, y_pred, average='weighted')
        f1 = f1_score(y_test, y_pred, average='weighted')
        
        print(f"\nOverall Metrics:")
        print(f"  Accuracy:  {accuracy:.4f}")
        print(f"  Precision: {precision:.4f}")
        print(f"  Recall:    {recall:.4f}")
        print(f"  F1-Score:  {f1:.4f}")
        
        # Classification report
        print(f"\nDetailed Classification Report:")
        print("="*60)
        class_names = self.label_encoder.classes_
        print(classification_report(y_test, y_pred, target_names=class_names))
        
        return y_pred
    
    def plot_confusion_matrix(self, y_test, y_pred, save_path='plots/confusion_matrix_v2.png'):
        """Plot and save confusion matrix."""
        cm = confusion_matrix(y_test, y_pred)
        class_names = self.label_encoder.classes_
        
        plt.figure(figsize=(10, 8))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                    xticklabels=class_names, yticklabels=class_names)
        plt.title('Confusion Matrix - Improved Model', fontsize=16, fontweight='bold')
        plt.ylabel('True Label', fontsize=12)
        plt.xlabel('Predicted Label', fontsize=12)
        plt.tight_layout()
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"✓ Confusion matrix saved to {save_path}")
        plt.close()
    
    def plot_feature_importance(self, save_path='plots/feature_importance_v2.png'):
        """Plot and save feature importance."""
        importances = self.model.feature_importances_
        indices = np.argsort(importances)[::-1]
        
        plt.figure(figsize=(12, 8))
        plt.title('Feature Importance - Improved Model', fontsize=16, fontweight='bold')
        plt.bar(range(len(importances)), importances[indices], color='steelblue', alpha=0.8)
        plt.xticks(range(len(importances)), [self.feature_names[i] for i in indices], rotation=45, ha='right')
        plt.xlabel('Features', fontsize=12)
        plt.ylabel('Importance', fontsize=12)
        plt.tight_layout()
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"✓ Feature importance plot saved to {save_path}")
        plt.close()
        
        # Print feature importance values
        print(f"\nFeature Importance Rankings:")
        print("="*60)
        for i in indices:
            print(f"  {self.feature_names[i]:25s}: {importances[i]:.4f}")
    
    def save_model(self, model_path='models/solar_fault_model_v2.pkl',
                   scaler_path='models/preprocessors_scaler_v2.pkl',
                   encoder_path='models/preprocessors_label_encoder_v2.pkl'):
        """Save model and preprocessors."""
        joblib.dump(self.model, model_path)
        joblib.dump(self.scaler, scaler_path)
        joblib.dump(self.label_encoder, encoder_path)
        print(f"\n✓ Model saved to {model_path}")
        print(f"✓ Scaler saved to {scaler_path}")
        print(f"✓ Label encoder saved to {encoder_path}")


def main():
    """Main training pipeline."""
    print("\n" + "="*60)
    print("SOLAR PANEL FAULT DETECTION - IMPROVED MODEL TRAINING")
    print("="*60)
    
    # Step 1: Generate improved dataset
    print("\nStep 1: Generating improved synthetic dataset...")
    from src.improved_data_generator import ImprovedSolarDataGenerator
    generator = ImprovedSolarDataGenerator(n_samples=5000, random_state=42)
    df = generator.generate_dataset()
    df.to_csv('data/improved_solar_data.csv', index=False)
    
    # Step 2: Initialize detector
    detector = ImprovedSolarFaultDetector(random_state=42)
    
    # Step 3: Prepare data
    X_train, X_test, y_train, y_test = detector.prepare_data(df)
    
    # Step 4: Tune hyperparameters and train
    print("\nStep 2: Hyperparameter tuning (this may take a few minutes)...")
    detector.tune_hyperparameters(X_train, y_train)
    
    # Step 5: Evaluate model
    print("\nStep 3: Evaluating model...")
    y_pred = detector.evaluate_model(X_test, y_test)
    
    # Step 6: Plot confusion matrix
    print("\nStep 4: Generating visualizations...")
    detector.plot_confusion_matrix(y_test, y_pred)
    
    # Step 7: Plot feature importance
    detector.plot_feature_importance()
    
    # Step 8: Save model
    print("\nStep 5: Saving model...")
    detector.save_model()
    
    print("\n" + "="*60)
    print("MODEL TRAINING COMPLETED SUCCESSFULLY!")
    print("="*60)
    print("\nModel files created:")
    print("  - models/solar_fault_model_v2.pkl")
    print("  - models/preprocessors_scaler_v2.pkl")
    print("  - models/preprocessors_label_encoder_v2.pkl")
    print("\nVisualization files created:")
    print("  - plots/confusion_matrix_v2.png")
    print("  - plots/feature_importance_v2.png")
    print("\nThe model is compatible with existing prediction API.")
    print("="*60)


if __name__ == "__main__":
    main()
