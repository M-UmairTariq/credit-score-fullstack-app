import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
import pandas as pd
import mlflow.sklearn


from app.api.deps import CurrentUser, SessionDep
from app.models import PredictInputData

router = APIRouter()

model = mlflow.sklearn.load_model("mlruns/378252637221389687/108debc151654c30ae30925c06eeb557/artifacts/credit-scoring-model")

@router.post("/predict")
def predict(data: PredictInputData):
    try:
        # Convert the input data to a pandas DataFrame
        input_df = pd.DataFrame([data.dict()])

        # Predict using the loaded model
        prediction = model.predict(input_df)

        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))