import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
import pandas as pd
import mlflow.sklearn

from app.api.deps import CurrentUser, SessionDep
from app.models import PredictInputData

router = APIRouter()

# Load the model
model = mlflow.sklearn.load_model("mlruns/378252637221389687/108debc151654c30ae30925c06eeb557/artifacts/credit-scoring-model")

@router.post("/predict")
def predict(data: PredictInputData):
    try:
        # Convert input data to a DataFrame
        input_df = pd.DataFrame([data.dict()])

        # Make the prediction
        prediction = model.predict(input_df)
        
        # Ensure the prediction is correctly formatted
        if isinstance(prediction, (list, tuple)) and len(prediction) == 1:
            prediction = prediction[0]  # Unpack if single prediction

        # If the prediction is not a simple string, convert it
        if not isinstance(prediction, str):
            prediction = str(prediction)  # Ensure it's a string

        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
