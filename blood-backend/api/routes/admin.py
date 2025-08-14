# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Literal
from datetime import datetime, timedelta
import random

# Initialize the FastAPI application
app = FastAPI(title="Admin Dashboard API", description="API endpoints to power the admin dashboard.")

# Pydantic models for data validation and response serialization
class SystemMetrics(BaseModel):
    """Model for system health metrics."""
    total_donors: int
    active_hospitals: int
    alerts_today: int
    successful_matches: int
    average_response_time: str
    system_uptime: str
    api_response_time_ms: int
    db_status: Literal["Normal", "Degraded", "Offline"]
    notification_service_status: Literal["Online", "Offline"]
    sms_gateway_status: Literal["Online", "Degraded", "Offline"]
    cpu_usage_percent: float
    memory_usage_percent: float
    storage_usage_percent: float
    
class NetworkActivity(BaseModel):
    """Model for network activity logs."""
    id: str
    type: Literal['alert', 'match', 'donation', 'registration']
    description: str
    timestamp: datetime
    status: Literal['success', 'pending', 'failed']
    location: str
    
class UserSummary(BaseModel):
    """Model for user management summaries."""
    active_donors: int
    new_donors_this_week: int
    hospital_partners: int
    pending_hospital_verification: int
    system_admins: int
    
class AlertConfiguration(BaseModel):
    """Model for alert configuration settings."""
    critical_threshold: str
    auto_escalation_time: str
    max_donor_notifications: str
    backup_hospital_range: str
    
class AlertPerformance(BaseModel):
    """Model for a single alert's performance metrics."""
    alert_type: str
    status: Literal["Resolved", "In Progress", "Failed"]
    donors_notified: int
    responses: int
    avg_response_time: str
    
class AlertManagement(BaseModel):
    """Model for the full alert management section."""
    alert_config: AlertConfiguration
    recent_performance: List[AlertPerformance]

# Mock data to simulate a database. In a real application, you'd fetch this from a database.
mock_system_metrics = SystemMetrics(
    total_donors=12847,
    active_hospitals=89,
    alerts_today=34,
    successful_matches=28,
    average_response_time='8.5 min',
    system_uptime='99.97%',
    api_response_time_ms=127,
    db_status="Normal",
    notification_service_status="Online",
    sms_gateway_status="Degraded",
    cpu_usage_percent=23.0,
    memory_usage_percent=67.0,
    storage_usage_percent=45.0
)

mock_network_activity = [
    NetworkActivity(
        id='1',
        type='alert',
        description='Critical B- blood alert sent to 145 donors',
        timestamp=datetime.now() - timedelta(minutes=10),
        status='success',
        location='City General Hospital'
    ),
    NetworkActivity(
        id='2',
        type='match',
        description='Donor matched for emergency O+ request',
        timestamp=datetime.now() - timedelta(minutes=15),
        status='success',
        location='Metro Medical Center'
    ),
    NetworkActivity(
        id='3',
        type='donation',
        description='Blood donation completed successfully',
        timestamp=datetime.now() - timedelta(minutes=25),
        status='success',
        location='Regional Blood Bank'
    ),
    NetworkActivity(
        id='4',
        type='registration',
        description='New hospital registered in network',
        timestamp=datetime.now() - timedelta(minutes=75),
        status='pending',
        location='Suburban Medical Center'
    )
]

mock_user_summary = UserSummary(
    active_donors=12847,
    new_donors_this_week=127,
    hospital_partners=89,
    pending_hospital_verification=3,
    system_admins=12
)

mock_alert_management = AlertManagement(
    alert_config=AlertConfiguration(
        critical_threshold="≤ 5 units",
        auto_escalation_time="15 minutes",
        max_donor_notifications="200 per alert",
        backup_hospital_range="50 km radius"
    ),
    recent_performance=[
        AlertPerformance(
            alert_type="B- Critical Alert",
            status="Resolved",
            donors_notified=145,
            responses=12,
            avg_response_time="6.5 min"
        ),
        AlertPerformance(
            alert_type="O+ High Priority",
            status="In Progress",
            donors_notified=89,
            responses=18,
            avg_response_time="4.2 min"
        )
    ]
)

# Endpoint to get the main system metrics for the dashboard
@app.get("/api/dashboard/metrics", response_model=SystemMetrics)
async def get_system_metrics():
    """
    Fetches the real-time system metrics for the admin dashboard overview.
    
    This endpoint provides key performance indicators like donor count, hospital status,
    and system health.
    """
    # Simulate dynamic data changes
    mock_system_metrics.alerts_today = random.randint(30, 40)
    mock_system_metrics.successful_matches = random.randint(25, 35)
    mock_system_metrics.api_response_time_ms = random.randint(100, 200)
    mock_system_metrics.cpu_usage_percent = round(random.uniform(20.0, 30.0), 1)
    
    return mock_system_metrics

# Endpoint to get the real-time network activity feed
@app.get("/api/dashboard/activity", response_model=List[NetworkActivity])
async def get_network_activity():
    """
    Retrieves a list of recent network activities.
    
    This feed includes alerts, matches, donations, and new registrations.
    It can be filtered or paginated in a more advanced implementation.
    """
    return mock_network_activity

# Endpoint for analytics data. The frontend handles the visualization.
@app.get("/api/dashboard/analytics/response-time")
async def get_response_time_analytics():
    """
    Provides data on average response times for different alert priorities.
    """
    return {
        "critical_alerts_avg_time": "6.2 min",
        "high_priority_avg_time": "8.7 min",
        "medium_priority_avg_time": "12.4 min"
    }

# Endpoint for analytics data on success rates by blood type.
@app.get("/api/dashboard/analytics/success-rate")
async def get_success_rate_analytics():
    """
    Provides data on blood request fulfillment rates by blood type.
    """
    return {
        "data": [
            {"blood_type": "O-", "success_rate": 85},
            {"blood_type": "B-", "success_rate": 87},
            {"blood_type": "AB-", "success_rate": 89},
            {"blood_type": "A-", "success_rate": 91},
            {"blood_type": "O+", "success_rate": 93},
            {"blood_type": "B+", "success_rate": 95},
            {"blood_type": "A+", "success_rate": 97},
            {"blood_type": "AB+", "success_rate": 99},
        ]
    }
    
# Endpoint to get alert management configuration and performance
@app.get("/api/dashboard/alerts", response_model=AlertManagement)
async def get_alert_management():
    """
    Retrieves alert management settings and performance data for recent alerts.
    """
    return mock_alert_management

# Endpoint to get user management summary statistics
@app.get("/api/dashboard/users", response_model=UserSummary)
async def get_user_summary():
    """
    Provides a summary of user statistics, including donors, hospitals, and admins.
    """
    return mock_user_summary
    
# Endpoint to handle the "Test Emergency Alert" button
@app.post("/api/dashboard/alerts/test")
async def test_emergency_alert():
    """
    Simulates sending a test emergency alert.
    
    This would trigger a real-world action in a production system.
    """
    return {"message": "Test emergency alert triggered successfully."}