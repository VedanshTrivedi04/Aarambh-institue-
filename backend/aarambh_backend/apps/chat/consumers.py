import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, Message
from apps.users.models import CustomUser

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        self.user = self.scope['user']

        if not self.user.is_authenticated:
            await self.close()
            return

        is_participant = await self.is_participant(self.room_id, self.user)
        if not is_participant:
            await self.close()
            return

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_content = text_data_json['message']

        # Save message to DB
        saved_msg = await self.save_message(self.room_id, self.user, message_content)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': saved_msg['content'],
                'sender_id': str(saved_msg['sender_id']),
                'sender_name': saved_msg['sender_name'],
                'message_id': str(saved_msg['id']),
                'created_at': saved_msg['created_at']
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def is_participant(self, room_id, user):
        try:
            room = ChatRoom.objects.get(id=room_id)
            return user in room.participants.all()
        except ChatRoom.DoesNotExist:
            return False

    @database_sync_to_async
    def save_message(self, room_id, user, content):
        room = ChatRoom.objects.get(id=room_id)
        msg = Message.objects.create(room=room, sender=user, content=content)
        # Update room's updated_at timestamp to bubble it up in lists
        room.save()
        return {
            'id': msg.id,
            'content': msg.content,
            'sender_id': user.id,
            'sender_name': f"{user.first_name} {user.last_name}",
            'created_at': msg.created_at.isoformat()
        }
