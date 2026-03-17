"""
ML Training Pipeline - Mini AI Sales Prediction System

Model   : Random Forest Classifier
Dataset : data/sales_data.csv
Output  : ml/model.pkl

Usage:
    python ml/training_model.py
"""

import os
import sys

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder


# --- CONFIGURATION ------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATASET_PATH = os.path.join(BASE_DIR, "data", "sales_data.csv")
MODEL_OUTPUT_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "model.pkl"
)

FEATURE_COLUMNS = ["jumlah_penjualan", "harga", "diskon"]
LABEL_COLUMN = "status"

TEST_SIZE = 0.2
RANDOM_STATE = 42


# --- DATA LOADING ------------------------------
def load_dataset(path: str) -> pd.DataFrame:
    """Muat dataset CSV dan validasi kolom yang dibutuhkan."""

    if not os.path.exists(path):
        sys.exit(f"[ERROR] Dataset tidak ditemukan: {path}")

    df = pd.read_csv(path)

    required_columns = FEATURE_COLUMNS + [LABEL_COLUMN]
    missing_columns = [col for col in required_columns if col not in df.columns]

    if missing_columns:
        sys.exit(f"[ERROR] Kolom yang hilang: {missing_columns}")

    print(f"[INFO] Dataset loaded: {len(df):,} rows")
    return df


# --- PREPROCESSING ------------------------------
def preprocess(df: pd.DataFrame) -> tuple:
    """Bersihkan data dan ubah label menjadi nilai numerik."""

    df = df.dropna(subset=FEATURE_COLUMNS + [LABEL_COLUMN]).copy()
    df[LABEL_COLUMN] = df[LABEL_COLUMN].str.strip()

    encoder = LabelEncoder()
    df["label_encoded"] = encoder.fit_transform(df[LABEL_COLUMN])

    X = df[FEATURE_COLUMNS].astype(float)
    y = df["label_encoded"]

    print("\n[INFO] Class distribution:")
    for label, count in df[LABEL_COLUMN].value_counts().items():
        pct = count / len(df) * 100
        print(f"  {label:10s}: {count:,} ({pct:.1f}%)")

    return X, y, encoder


# --- MODEL TRAINING ------------------------------
def train_model(X_train: pd.DataFrame, y_train: pd.Series) -> RandomForestClassifier:
    """Latih dan kembalikan model Random Forest classifier."""

    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        random_state=RANDOM_STATE,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)
    return model


# --- MODEL EVALUATION ------------------------------
def evaluate_model(
    model: RandomForestClassifier,
    X_test: pd.DataFrame,
    y_test: pd.Series,
    encoder: LabelEncoder,
) -> None:
    """Print metrik evaluasi untuk model yang telah dilatih."""

    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)

    print("\n" + "=" * 50)
    print(f"Akurasi Model: {accuracy:.4f} ({accuracy * 100:.2f}%)")
    print("=" * 50)

    print("\nLaporan Klasifikasi:")
    print(classification_report(y_test, predictions, target_names=encoder.classes_))

    print("Matrix Konfusi:")
    print(confusion_matrix(y_test, predictions))


# --- MODEL SAVING ------------------------------
def save_model(
    model: RandomForestClassifier,
    encoder: LabelEncoder,
    output_path: str,
) -> None:
    """Serialisasikan dan simpan model ke disk."""

    artifact = {
        "model_machine_learning": model,
        "label_encoder": encoder,
        "daftar_fitur": FEATURE_COLUMNS,
        "daftar_kelas": list(encoder.classes_),
        "versi_model": "1.0.0",
    }

    joblib.dump(artifact, output_path)

    size_kb = os.path.getsize(output_path) / 1024
    print(f"[INFO] Model disimpan ke {output_path} ({size_kb:.1f} KB)")


# --- MAIN PIPELINE ------------------------------
def main() -> None:
    print("\n" + "=" * 50)
    print("Mini AI Sales Prediction System - Model Training")
    print("=" * 50)

    # 1. Load dataset
    df = load_dataset(DATASET_PATH)

    # 2. Preprocess
    X, y, encoder = preprocess(df)

    # 3. Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
        stratify=y,
    )

    print(f"\n[INFO] Sampel Training : {len(X_train):,}")
    print(f"[INFO] Sampel Testing    : {len(X_test):,}")

    # 4. Train
    print("\n[INFO] Training Random Forest model...")
    model = train_model(X_train, y_train)

    # 5. Evaluate
    evaluate_model(model, X_test, y_test, encoder)

    # 6. Save
    save_model(model, encoder, MODEL_OUTPUT_PATH)

    print("\n[SUCCESS] Proses training selesai.\n")


if __name__ == "__main__":
    main()
