#!/bin/bash

# フロントエンドとバックエンドを同時に起動するスクリプト

echo "CareerPact開発サーバーを起動中..."

# バックエンドを起動
cd backend
echo "バックエンドサーバーを起動中..."
python main.py &
BACKEND_PID=$!

# フロントエンドを起動
cd ../frontend
echo "フロントエンドサーバーを起動中..."
npm run dev &
FRONTEND_PID=$!

# 終了時の処理
cleanup() {
    echo "サーバーを停止中..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Ctrl+Cで終了時にクリーンアップ
trap cleanup SIGINT SIGTERM

echo "両方のサーバーが起動しました!"
echo "フロントエンド: http://localhost:5173"
echo "バックエンド: http://localhost:8000"
echo "終了するには Ctrl+C を押してください"

# プロセスが終了するまで待機
wait
