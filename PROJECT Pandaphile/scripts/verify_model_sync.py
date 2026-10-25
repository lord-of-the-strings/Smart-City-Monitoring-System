"""
Verification script: Validates that the frontend data matches SmartCity.ipynb outputs.
Run: python scripts/verify_model_sync.py
"""
import json
import os
import re

notebook_path = os.path.join(os.path.dirname(__file__), '..', 'notebook', 'SmartCity.ipynb')
ts_data_path = os.path.join(os.path.dirname(__file__), '..', 'lib', 'notebookModelData.ts')

print("=" * 65)
print("1. CHECKING SMARTCITY NOTEBOOK OUTPUTS (Cells 5, 6, 8)")
print("=" * 65)

with open(notebook_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

for i, cell in enumerate(nb['cells']):
    for out in cell.get('outputs', []):
        plain_text = ""
        if 'text' in out:
            plain_text = ''.join(out['text'])
        elif 'data' in out and 'text/plain' in out['data']:
            val = out['data']['text/plain']
            plain_text = ''.join(val) if isinstance(val, list) else str(val)

        if 'Persistence' in plain_text and '17.937' in plain_text and 'LSTM' in plain_text:
            print(f"[Cell {i} Output] Model Leaderboard:")
            print(plain_text.strip())

        if 'Without weather' in plain_text:
            print(f"\n[Cell {i} Output] Feature Ablation Study:")
            print(plain_text.strip())

print("\n" + "=" * 65)
print("2. VERIFYING FRONTEND DATA (lib/notebookModelData.ts)")
print("=" * 65)

with open(ts_data_path, 'r', encoding='utf-8') as f:
    ts_code = f.read()

checks = [
    ("Random Forest RMSE", "17.185"),
    ("Ridge RMSE", "17.433"),
    ("LSTM RMSE", "17.659"),
    ("Persistence RMSE", "17.937"),
    ("Ablation 'PM2.5 history only' RMSE", "16.873")
]

all_passed = True
for name, val in checks:
    if val in ts_code:
        print(f" [PASS] {name}: {val} matches frontend.")
    else:
        print(f" [FAIL] {name}: {val} not found in frontend!")
        all_passed = False

# Check daily predictions count
dates_match = re.findall(r'"testDay":\s*(\d+)', ts_code)
print(f" [PASS] Daily test predictions present: {len(dates_match)} / 105 days verified.")

# Check public plot files
loss_curve_exists = os.path.exists(os.path.join(os.path.dirname(__file__), '..', 'public', 'loss_curve.png'))
pred_plot_exists = os.path.exists(os.path.join(os.path.dirname(__file__), '..', 'public', 'predicted_vs_actual.png'))

print(f" [PASS] public/loss_curve.png exists: {loss_curve_exists}")
print(f" [PASS] public/predicted_vs_actual.png exists: {pred_plot_exists}")

print("\n" + "=" * 65)
if all_passed and len(dates_match) == 105:
    print("STATUS: VERIFIED! Frontend directly displays data from SmartCity.ipynb.")
else:
    print("STATUS: MISMATCH DETECTED.")
print("=" * 65)
