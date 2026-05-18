import os
import google.genai as genai
import json
import re

class AIService:
    def __init__(self, api_key):
        cleaned_key = (api_key or "").strip()
        self.client = genai.Client(api_key=cleaned_key)
        self.model_name = os.getenv("GEMINI_MODEL")
        fallback_raw = os.getenv("GEMINI_MODEL_FALLBACKS", "")
        fallbacks = [model.strip() for model in fallback_raw.split(",") if model.strip()]
        self.model_fallbacks = [self.model_name, *fallbacks]

    def _generate_content(self, prompt):
        last_error = None
        for model in self.model_fallbacks:
            try:
                return self.client.models.generate_content(
                    model=model,
                    contents=prompt,
                )
            except Exception as e:
                last_error = e
                error_text = str(e)
                if "NOT_FOUND" in error_text or "not found" in error_text:
                    continue
                raise
        if last_error:
            raise last_error
        raise ValueError("No Gemini models available")

    def _get_mode_instruction(self, mode):
        """Returns mode-specific instructions for Gemini."""
        if mode == 'Focused':
            return "MODE: FOCUSED. Prioritize efficiency and deadlines aggressively. Reduce distractions. Increase urgency in recommendations. Focus on immediate task execution and high-priority objectives."
        elif mode == 'Relaxed':
            return "MODE: RELAXED. Optimize for mental wellness and light workload. Reduce urgency. Prioritize mental recovery and low-pressure productivity. Move non-urgent tasks to later cycles."
        else:
            return "MODE: BALANCED. Maintain productivity while avoiding overload. Realistic scheduling and mental wellness balance. Recommend short breaks and steady progress."

    def prioritize_tasks(self, tasks, mode='Balanced'):
        """
        Takes a list of tasks and returns an optimized prioritization list 
        with AI-generated insights (aiLabel).
        """
        if not tasks:
            return []

        # Prepare a clean list of tasks for the AI to analyze
        task_list_str = "\n".join([
            f"- ID: {t['_id']}, Title: {t['title']}, Priority: {t['priority']}, Due: {t['due']}, Desc: {t['desc']}"
            for t in tasks
        ])

        prompt = f"""
        You are the FLOWMIND AI Brain. Your job is to analyze the following tasks and optimize their priorities and AI insights.
        
        {self._get_mode_instruction(mode)}

        Tasks:
        {task_list_str}
        
        Instructions:
        1. Review each task's priority and description.
        2. Assign a more accurate priority if needed (HIGH PRIORITY, MEDIUM, LOW).
        3. Set an urgency level (HIGH, MEDIUM, LOW).
        4. Provide a concise reason (max 12 words) explaining the urgency.
        5. Generate a short, professional "aiLabel" (max 10 words) that sounds like a neural assistant (e.g., "AI: High cognitive load detected. Execute now.").
        6. Return the result as a JSON array of objects with '_id', 'priority', 'urgency', 'reason', and 'aiLabel' fields only.
        
                JSON Format Example:
                [
                    {{"_id": "...", "priority": "HIGH PRIORITY", "urgency": "HIGH", "reason": "Deadline tomorrow", "aiLabel": "AI: Execute now."}},
                    ...
                ]
        
        ONLY return the JSON array, no other text.
        """

        try:
            response = self._generate_content(prompt)
            json_str = response.text.strip() if response and response.text else ""

            if json_str.startswith("```json"):
                json_str = json_str[7:-3].strip()
            elif json_str.startswith("```"):
                json_str = json_str[3:-3].strip()

            if not json_str:
                raise ValueError("Empty Gemini response")

            try:
                data = json.loads(json_str)
            except json.JSONDecodeError:
                match = re.search(r"\[[\s\S]*\]", json_str)
                if not match:
                    raise ValueError("Gemini response did not contain JSON array")
                data = json.loads(match.group(0))

            if not isinstance(data, list):
                raise ValueError("Gemini response was not a JSON array")

            return data
        except Exception as e:
            print(f"Task Prioritization Error: {e}")
            raise

    def analyze_task(self, task, mode='Balanced'):
        """
        Performs a deep analysis of a single task, generating subtasks 
        and focus recommendations.
        """
        prompt = f"""
        You are the FLOWMIND AI Strategist. Analyze this specific task:
        
        {self._get_mode_instruction(mode)}

        Title: {task['title']}
        Description: {task.get('desc', 'No description provided.')}
        Priority: {task.get('priority', 'MEDIUM')}
        
        Provide a deep strategic breakdown in JSON format:
        1. 'subtasks': A list of 3-5 actionable steps.
        2. 'estimated_time': A string (e.g. '2.5 hours').
        3. 'focus_tip': A short tip for staying focused on this specific work.
        4. 'complexity': One of [Low, Medium, High].
        
        ONLY return the JSON object.
        """
        try:
            response = self._generate_content(prompt)
            json_str = response.text.strip()
            if json_str.startswith("```json"):
                json_str = json_str[7:-3].strip()
            elif json_str.startswith("```"):
                json_str = json_str[3:-3].strip()
            return json.loads(json_str)
        except Exception as e:
            print(f"Task Analysis Error: {e}")
            return None

    def analyze_workload(self, tasks, mode='Balanced'):
        """
        Analyzes the entire task list to provide high-level productivity 
        insights and burnout warnings.
        """
        if not tasks:
            return {"focus_score": 0, "burnout_risk": "None", "recommendation": "Start by adding some tasks!"}

        task_summary = "\n".join([
            f"- {t['title']} | Priority: {t['priority']} | Status: {t['status']} | Due: {t['due']}" 
            for t in tasks
        ])
        
        prompt = f"""
        You are the FLOWMIND AI Executive Assistant. Analyze this user's task history and current load:
        
        {self._get_mode_instruction(mode)}

        {task_summary}
        
        Analysis Criteria:
        1. Work Consistency: Ratio of completed vs pending tasks in this list.
        2. Pending Load: Total number of active tasks and their combined complexity.
        3. Missed Deadlines: Identify any tasks that are PENDING but have a past due date.
        
        Provide a strategic report in JSON format:
        1. 'focus_score': An integer (0-100) representing total NEURAL WORKLOAD %.
        2. 'burnout_risk': One of [Low, Moderate, High, Critical].
        3. 'recommendation': High-level advice (max 15 words).
        4. 'smart_move': A specific 'Focus Move' recommendation (e.g., 'Finish UI work before starting authentication').
        5. 'consistency_level': A short description of their work habit.
        
        ONLY return JSON.
        """
        try:
            response = self._generate_content(prompt)
            json_str = response.text.strip()
            if json_str.startswith("```json"):
                json_str = json_str[7:-3].strip()
            elif json_str.startswith("```"):
                json_str = json_str[3:-3].strip()
            return json.loads(json_str)
        except Exception as e:
            print(f"Workload Analysis Error: {e}")
            return None

    def generate_urgency_insight(self, tasks, mode='Balanced'):
        """
        Generates an urgency-focused recommendation for high-priority tasks.
        """
        if not tasks:
            return None

        task_summary = "\n".join([
            f"- {t.get('title', 'Untitled')} | Priority: {t.get('priority', 'MEDIUM')} | Due: {t.get('due', 'N/A')}"
            for t in tasks
        ])

        prompt = f"""
        You are the FLOWMIND AI Executive Assistant. Create a brief urgency alert
        for the user based on their high-priority tasks.
        
        {self._get_mode_instruction(mode)}

        Tasks:
        {task_summary}

        Return JSON with:
        1. 'urgency_level': One of [High, Medium, Low]
        2. 'urgency_message': A short, personalized alert (max 18 words)
        3. 'focus_suggestion': A concise next action (max 12 words)

        ONLY return JSON.
        """

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
            )
            json_str = response.text.strip()
            if json_str.startswith("```json"):
                json_str = json_str[7:-3].strip()
            elif json_str.startswith("```"):
                json_str = json_str[3:-3].strip()
            return json.loads(json_str)
        except Exception as e:
            print(f"Urgency Insight Error: {e}")
            return None

    def generate_overview(self, tasks, mode='Balanced'):
        """Generates a high-level AI cognitive overview for the user."""
        if not tasks:
            return {
                "summary": "No active tasks detected. Your neural slate is clean.",
                "productivity_state": "RESTING",
                "burnout_status": "NONE",
                "focus_score": 0,
                "optimization_status": "READY"
            }

        task_summary = "\n".join([
            f"- {t['title']} | Due: {t['due']} | Priority: {t['priority']}" 
            for t in tasks if t.get('status') != 'COMPLETED'
        ])
        
        prompt = f"""
        You are the FLOWMIND AI Executive Assistant. Generate a SYSTEM SYNC OVERVIEW for this user's current load:
        
        {self._get_mode_instruction(mode)}

        {task_summary}
        
        Requirements:
        1. Personalized summary (max 20 words) - focus on urgent tasks.
        2. Productivity State (e.g., SYNCED, OVERLOAD, OPTIMAL, CRITICAL).
        3. Burnout Status (Low, Moderate, High).
        4. Focus Score (0-100).
        5. Optimization Status (e.g., READY, NEEDED, OPTIMIZED).
        
        Example Summary: "Prioritize high-impact portfolio tasks today to reduce tomorrow's cognitive load."
        
        Return ONLY a JSON object with these keys: 
        'summary', 'productivity_state', 'burnout_status', 'focus_score', 'optimization_status'.
        """
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
            )
            json_str = response.text.strip()
            if json_str.startswith("```json"):
                json_str = json_str[7:-3].strip()
            elif json_str.startswith("```"):
                json_str = json_str[3:-3].strip()
            
            return json.loads(json_str)
        except Exception as e:
            print(f"Overview Generation Error: {e}")
            return None
    def generate_smart_schedule(self, tasks, mode='Balanced'):
        """
        Analyzes tasks to generate an ideal daily schedule with focus blocks, 
        breaks, and an execution order.
        """
        if not tasks:
            return None

        task_summary = "\n".join([
            f"- {t['title']} | Duration: {t.get('estimated_time', 'Not set')} | Priority: {t['priority']} | Due: {t['due']}" 
            for t in tasks if t.get('status') != 'COMPLETED'
        ])
        
        prompt = f"""
        You are the FLOWMIND AI Scheduler. Generate an optimized daily schedule for the user based on these tasks:
        
        {self._get_mode_instruction(mode)}

        {task_summary}
        
        Analyze:
        1. Workload vs. Available cognitive energy.
        2. Estimated task durations.
        3. Productivity patterns (assume peak focus in the morning).
        4. Deadlines.
        
        Generate:
        1. Ideal work sessions (specific time slots).
        2. Focus timing (when to go deep).
        3. Break intervals (when to recover).
        4. Execution order (which task to start first, second, etc.).
        
        Return a JSON object with:
        'schedule_recommendation': A short summary (e.g., "Best deep work window: 7 PM – 9 PM.")
        'focus_blocks': A list of objects with 'time', 'task_title', and 'duration'.
        'breaks': A list of objects with 'time' and 'duration'.
        'execution_plan': A list of task titles in recommended order.
        'neural_logic': A short explanation of why this schedule was chosen.
        
        ONLY return JSON.
        """
        try:
            response = self._generate_content(prompt)
            json_str = response.text.strip()
            if json_str.startswith("```json"):
                json_str = json_str[7:-3].strip()
            elif json_str.startswith("```"):
                json_str = json_str[3:-3].strip()
            
            return json.loads(json_str)
        except Exception as e:
            print(f"Scheduling Error: {e}")
            return None

    def analyze_burnout(self, tasks, mode='Balanced'):
        """
        Performs a deep AI analysis of the user's workload to detect burnout 
        risk and provide recovery advice.
        """
        if not tasks:
            return {
                "risk_level": "Low",
                "recovery_recommendation": "Your neural slate is clean. Ready for new input.",
                "workload_advice": "Maintain current resting state."
            }

        task_summary = "\n".join([
            f"- {t['title']} | Priority: {t['priority']} | Status: {t['status']} | Due: {t['due']}" 
            for t in tasks
        ])
        
        prompt = f"""
        You are the FLOWMIND AI Health Strategist. Analyze this user's task data for burnout risk:
        
        {self._get_mode_instruction(mode)}

        {task_summary}
        
        Analysis Criteria:
        1. Workload Density (total active tasks).
        2. Overdue Pressure (tasks past their due date).
        3. Completion Consistency (ratio of finished vs pending).
        4. Task Accumulation (rate of new tasks being added).
        
        Generate:
        1. 'risk_level': One of [Low, Moderate, High].
        2. 'recovery_recommendation': A short personalized recovery tip (max 12 words).
        3. 'workload_advice': Specific advice on how to handle the current load (max 15 words).
        
        Example Advice: "Shift low-priority tasks to Friday."
        
        Return ONLY a JSON object.
        """
        try:
            response = self._generate_content(prompt)
            json_str = response.text.strip()
            if json_str.startswith("```json"):
                json_str = json_str[7:-3].strip()
            elif json_str.startswith("```"):
                json_str = json_str[3:-3].strip()
            
            return json.loads(json_str)
        except Exception as e:
            print(f"Burnout Analysis Error: {e}")
            return None

    def predict_productivity(self, tasks, analytics_summary, mode='Balanced'):
        """
        Uses AI to predict future productivity outcomes based on current 
        workload and historical trends.
        """
        if not tasks:
            return None

        task_summary = "\n".join([
            f"- {t['title']} | Priority: {t['priority']} | Status: {t['status']} | Due: {t['due']}" 
            for t in tasks
        ])
        
        prompt = f"""
        You are the FLOWMIND AI Predictive Analyst. Based on this data:
        
        {self._get_mode_instruction(mode)}

        TASKS:
        {task_summary}
        
        ANALYTICS SUMMARY:
        {analytics_summary}
        
        Predict:
        1. 'completion_probability': Percentage (e.g., 85%).
        2. 'deadline_risk': Risk level for upcoming deadlines (Low, Moderate, High).
        3. 'weekly_estimate': Estimated number of tasks to be completed this week.
        4. 'focus_success_rate': Predicted success rate for deep work sessions.
        5. 'prediction_message': A short summary message (e.g., "You are likely to complete 85% of high-priority tasks this week.")
        6. 'neural_outlook': A short strategic outlook (max 20 words).
        
        Return ONLY a JSON object.
        """
        try:
            response = self._generate_content(prompt)
            json_str = response.text.strip()
            if json_str.startswith("```json"):
                json_str = json_str[7:-3].strip()
            elif json_str.startswith("```"):
                json_str = json_str[3:-3].strip()
            
            return json.loads(json_str)
        except Exception as e:
            print(f"Prediction Error: {e}")
            return None

    def analyze_productivity_intelligence(self, tasks, stats, mode='Balanced'):
        """
        Provides a professional SaaS executive overview of productivity.
        Analyzes completion rates, overdue patterns, and focus consistency.
        """
        if not tasks:
            return None

        task_summary = "\n".join([
            f"- {t['title']} | Status: {t['status']} | Due: {t['due']}" 
            for t in tasks[:20]
        ])
        
        prompt = f"""
        You are the FLOWMIND Executive Productivity Consultant. Analyze this data:
        
        {self._get_mode_instruction(mode)}

        STATS:
        {stats}
        
        RECENT TASKS:
        {task_summary}
        
        Provide a professional executive analysis of productivity behavior.
        
        Generate:
        1. 'analysis_summary': A short, powerful insight (e.g., "Your cognitive flow peaks during morning hours. Task resolution improved by 14% this week.")
        2. 'ai_efficiency_score': A score from 0-100 based on execution efficiency.
        3. 'growth_percentage': Estimated productivity growth compared to a baseline (e.g., "+14.2%").
        4. 'behavioral_pattern': A short note on the user's working style.
        
        Return ONLY a JSON object.
        """
        try:
            response = self._generate_content(prompt)
            json_str = response.text.strip()
            if json_str.startswith("```json"):
                json_str = json_str[7:-3].strip()
            elif json_str.startswith("```"):
                json_str = json_str[3:-3].strip()
            
            return json.loads(json_str)
        except Exception as e:
            print(f"Productivity Intelligence Error: {e}")
            return None

    def analyze_distribution_insight(self, stats, mode='Balanced'):
        """
        Generates a short actionable recommendation based on workload distribution.
        """
        prompt = f"""
        You are the FLOWMIND AI Productivity Assistant. Analyze these distribution stats:
        
        {self._get_mode_instruction(mode)}

        {stats}
        
        Generate ONE short, powerful, actionable recommendation (max 15 words).
        Example: "You're 22% more productive on Tuesdays. Schedule deep work tomorrow."
        
        Return ONLY the string recommendation.
        """
        try:
            response = self._generate_content(prompt)
            return response.text.strip().replace('"', '')
        except Exception as e:
            print(f"Distribution Insight Error: {e}")
            return "Stabilizing workload. Keep focus on high-priority objectives."
