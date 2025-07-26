from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

app = FastAPI(title="CareerPact API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

class SkillType(str, Enum):
    WRITING = "文章作成"
    DATA_ENTRY = "データ入力"
    CUSTOMER_SUPPORT = "カスタマーサポート"
    DESIGN = "デザイン"
    TRANSLATION = "翻訳"

class ContactMethod(str, Enum):
    SLACK = "Slack"
    EMAIL = "メール"
    PHONE = "電話"

class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    SUPPORT_NEEDED = "support_needed"

class UserProfile(BaseModel):
    available_days: List[str]
    available_time_slots: List[str]
    weekly_hours: int
    skills: List[SkillType]
    preferred_contact: ContactMethod

class Task(BaseModel):
    id: str
    title: str
    description: str
    deadline: datetime
    estimated_hours: float
    required_skills: List[SkillType]
    priority: int
    status: TaskStatus = TaskStatus.PENDING

class DigitalBadge(BaseModel):
    id: str
    title: str
    description: str
    issued_date: datetime
    issuer_company: str
    task_id: str

# 仮のデータストア
user_profiles = {}
tasks = {}
badges = {}

@app.get("/")
async def root():
    return {"message": "CareerPact API"}

@app.post("/profile")
async def create_or_update_profile(profile: UserProfile):
    user_id = "user_1"  # 実際の実装では認証から取得
    user_profiles[user_id] = profile
    return {"message": "プロフィールが保存されました", "user_id": user_id}

@app.get("/profile/{user_id}")
async def get_profile(user_id: str):
    if user_id not in user_profiles:
        return {"error": "プロフィールが見つかりません", "profile": None}
    return {"profile": user_profiles[user_id]}

@app.get("/profile")
async def get_current_profile():
    user_id = "user_1"  # 実際の実装では認証から取得
    if user_id not in user_profiles:
        return {"profile": None}
    return {"profile": user_profiles[user_id]}

@app.get("/tasks")
async def get_tasks():
    # AIマッチングの代わりに、サンプルタスクを返す
    sample_tasks = [
        Task(
            id="task_1",
            title="商品説明文の作成",
            description="ECサイトの商品説明文を10件作成してください",
            deadline=datetime(2024, 2, 15, 17, 0),
            estimated_hours=2.0,
            required_skills=[SkillType.WRITING],
            priority=1
        ),
        Task(
            id="task_2", 
            title="顧客データの入力",
            description="エクセルファイルに顧客情報を50件入力してください",
            deadline=datetime(2024, 2, 12, 12, 0),
            estimated_hours=1.5,
            required_skills=[SkillType.DATA_ENTRY],
            priority=2
        )
    ]
    return sample_tasks

@app.post("/tasks/{task_id}/status")
async def update_task_status(task_id: str, status: TaskStatus):
    if task_id not in tasks:
        tasks[task_id] = {"status": status}
    else:
        tasks[task_id]["status"] = status
    return {"message": "タスクステータスが更新されました"}

@app.get("/badges")
async def get_badges():
    return list(badges.values())

@app.post("/badges")
async def create_badge(badge: DigitalBadge):
    badges[badge.id] = badge
    return {"message": "デジタルバッジが発行されました"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)