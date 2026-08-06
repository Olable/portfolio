#!/usr/bin/env bash
# Helper script to run both backend and frontend during development.
# Usage: ./run.sh
set -e

echo "Starting Django backend on http://localhost:8000 ..."
cd backend
source ../venv/bin/activate
python manage.py runserver 0.0.0.0:8000 &
BACK_PID=$!

echo "Starting React frontend on http://localhost:3000 ..."
cd ../frontend
npm run dev -- --host 0.0.0.0 &
FRONT_PID=$!

trap "kill $BACK_PID $FRONT_PID 2>/dev/null" INT TERM EXIT
wait
