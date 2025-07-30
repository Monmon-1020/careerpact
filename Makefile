.PHONY: dev frontend backend install-frontend

# 開発サーバーを起動（フロントエンド＋バックエンド）
dev:
	@echo "CareerPact開発サーバーを起動中..."
	@cd backend && python main.py & \
	cd frontend && npm run dev

# フロントエンドのみ起動
frontend:
	@cd frontend && npm run dev

# バックエンドのみ起動
backend:
	@cd backend && python main.py

# フロントエンドの依存関係をインストール
install-frontend:
	@cd frontend && npm install

# フロントエンドをビルド
build:
	@cd frontend && npm run build
