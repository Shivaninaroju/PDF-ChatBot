from typing import Dict, List, Tuple


class BoundedConversationMemory:
    """
    Manages bounded conversation history per session ID.
    Keeps up to max_history_turns (default: 6 turns) to prevent context inflation.
    """

    def __init__(self, max_history_turns: int = 6):
        self.max_history_turns = max_history_turns
        self._sessions: Dict[str, List[Tuple[str, str]]] = {}

    def add_turn(self, session_id: str, user_query: str, assistant_response: str):
        if session_id not in self._sessions:
            self._sessions[session_id] = []
        self._sessions[session_id].append((user_query, assistant_response))

        # Trim history if exceeding max_history_turns
        if len(self._sessions[session_id]) > self.max_history_turns:
            self._sessions[session_id] = self._sessions[session_id][-self.max_history_turns:]

    def get_formatted_history(self, session_id: str) -> str:
        turns = self._sessions.get(session_id, [])
        if not turns:
            return ""

        history_lines = []
        for user_q, assistant_a in turns:
            history_lines.append(f"User: {user_q}\nAssistant: {assistant_a}")
        return "\n\n".join(history_lines)

    def clear_session(self, session_id: str):
        if session_id in self._sessions:
            del self._sessions[session_id]


conversation_memory = BoundedConversationMemory()
