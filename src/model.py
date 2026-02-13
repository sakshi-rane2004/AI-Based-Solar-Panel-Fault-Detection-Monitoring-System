"""
Random Forest model for solar panel fault detection.
"""
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
from typing import Tuple, Dict, Any
import matplotlib.pyplot as plt
import seaborn as sns

class SolarFaultDetectionModel:
    """Random Forest classifier for solar panel fault detection."""
    
    def __init__(self, n_estimators: int = 100, random_state: int = 42, **kwargs):
        """
        Initialize Random Forest model.
        
        Args:
            n_estimators: Number of trees in the forest
            random_state: Random state for reproducibility
            **kwargs: Additional parameters for RandomForestClassifier
        """
        self.model = RandomForestClassifier(
            n_estimators=n_estimators,
            random_state=random_state,
            **kwargs
        )
        self.is_trained = False
        self.feature_names = ['voltage', 'current', 'temperature', 'irradiance', 'power']
        self.class_names = None
        
    def train(self, X_train: np.ndarray, y_train: np.ndarray) -> None:
        """
        Train the Random Forest model.
        
        Args:
            X_train: Training features
            y_train: Training labels
        """
        print("Training Random Forest model...")
        print(f"Training data shape: {X_train.shape}")
        print(f"Number of classes: {len(np.unique(y_train))}")
        
        self.model.fit(X_train, y_train)
        self.is_trained = True
        
        print("Model training completed!")
        
    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Make predictions using the trained model.
        
        Args:
            X: Features to predict
            
        Returns:
            Predicted class labels
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
            
        return self.model.predict(X)
    
    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """
        Get prediction probabilities.
        
        Args:
            X: Features to predict
            
        Returns:
            Prediction probabilities for each class
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
            
        return self.model.predict_proba(X)
    
    def evaluate(self, X_test: np.ndarray, y_test: np.ndarray, 
                class_names: list = None) -> Dict[str, Any]:
        """
        Evaluate model performance.
        
        Args:
            X_test: Test features
            y_test: Test labels
            class_names: Names of the classes
            
        Returns:
            Dictionary containing evaluation metrics
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before evaluation")
        
        print("Evaluating model performance...")
        
        # Make predictions
        y_pred = self.predict(X_test)
        y_pred_proba = self.predict_proba(X_test)
        
        # Calculate metrics
        accuracy = accuracy_score(y_test, y_pred)
        
        # Classification report
        report = classification_report(y_test, y_pred, target_names=class_names, output_dict=True)
        
        # Confusion matrix
        cm = confusion_matrix(y_test, y_pred)
        
        # Feature importance
        feature_importance = dict(zip(self.feature_names, self.model.feature_importances_))
        
        results = {
            'accuracy': accuracy,
            'classification_report': report,
            'confusion_matrix': cm,
            'feature_importance': feature_importance,
            'predictions': y_pred,
            'prediction_probabilities': y_pred_proba
        }
        
        # Print results
        print(f"Accuracy: {accuracy:.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred, target_names=class_names))
        
        print("\nFeature Importance:")
        for feature, importance in sorted(feature_importance.items(), 
                                        key=lambda x: x[1], reverse=True):
            print(f"{feature}: {importance:.4f}")
        
        return results
    
    def plot_confusion_matrix(self, cm: np.ndarray, class_names: list, 
                            save_path: str = None) -> None:
        """
        Plot confusion matrix.
        
        Args:
            cm: Confusion matrix
            class_names: Names of the classes
            save_path: Path to save the plot
        """
        plt.figure(figsize=(10, 8))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                   xticklabels=class_names, yticklabels=class_names)
        plt.title('Confusion Matrix - Solar Panel Fault Detection')
        plt.xlabel('Predicted')
        plt.ylabel('Actual')
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
            print(f"Confusion matrix saved to {save_path}")
        
        plt.show()
    
    def plot_feature_importance(self, save_path: str = None) -> None:
        """
        Plot feature importance.
        
        Args:
            save_path: Path to save the plot
        """
        if not self.is_trained:
            raise ValueError("Model must be trained to plot feature importance")
        
        importance_df = pd.DataFrame({
            'feature': self.feature_names,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=True)
        
        plt.figure(figsize=(10, 6))
        plt.barh(importance_df['feature'], importance_df['importance'])
        plt.title('Feature Importance - Solar Panel Fault Detection')
        plt.xlabel('Importance')
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
            print(f"Feature importance plot saved to {save_path}")
        
        plt.show()
    
    def save_model(self, filepath: str) -> None:
        """
        Save the trained model.
        
        Args:
            filepath: Path to save the model
        """
        if not self.is_trained:
            raise ValueError("Model must be trained before saving")
        
        joblib.dump(self.model, filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath: str) -> None:
        """
        Load a trained model.
        
        Args:
            filepath: Path to the saved model
        """
        self.model = joblib.load(filepath)
        self.is_trained = True
        print(f"Model loaded from {filepath}")
    
    def get_model_info(self) -> Dict[str, Any]:
        """
        Get information about the trained model.
        
        Returns:
            Dictionary containing model information
        """
        if not self.is_trained:
            return {"status": "Model not trained"}
        
        return {
            "model_type": "RandomForestClassifier",
            "n_estimators": self.model.n_estimators,
            "n_features": self.model.n_features_in_,
            "n_classes": self.model.n_classes_,
            "feature_names": self.feature_names,
            "is_trained": self.is_trained
        }