import uuid
from django.db import models
from apps.users.models import CustomUser

class ChatRoom(models.Model):
    """
    Can be a group chat (e.g. for a Batch) or 1-on-1 (e.g. Student <-> Teacher).
    """
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name            = models.CharField(max_length=255, null=True, blank=True)
    is_group        = models.BooleanField(default=False)
    participants    = models.ManyToManyField(CustomUser, related_name="chat_rooms")
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "chat_chatroom"

    def __str__(self):
        return self.name or f"ChatRoom {self.id}"

class Message(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room            = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name="messages")
    sender          = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name="sent_messages")
    content         = models.TextField()
    is_read         = models.BooleanField(default=False)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "chat_message"
        ordering = ["created_at"]

    def __str__(self):
        return f"From {self.sender} in {self.room}: {self.content[:20]}"
