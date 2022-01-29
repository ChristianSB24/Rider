from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from trips.serializers import NestedTripSerializer, TripSerializer

from trips.models import Trip

class TaxiConsumer(AsyncJsonWebsocketConsumer):

    @database_sync_to_async
    def _create_trip(self, data):
        serializer = TripSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer.create(serializer.validated_data)

    @database_sync_to_async
    def _delete_trip(self, data):
        instance = Trip.objects.get(id=data.get('id'))
        id = instance
        instance.delete()
        return id

    @database_sync_to_async
    def _update_trip(self, data):
        instance = Trip.objects.get(id=data.get('id'))
        serializer = TripSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer.update(instance, serializer.validated_data)

    @database_sync_to_async
    def _get_trip_data(self, trip):
        return NestedTripSerializer(trip).data

    @database_sync_to_async
    def _get_user_group(self, user):
        return user.groups.first().name

    @database_sync_to_async
    def _get_trip_ids(self, user):
        user_groups = user.groups.values_list('name', flat=True)
        if 'driver' in user_groups:
            trip_ids = user.trips_as_driver.exclude(
                status=Trip.COMPLETED
            ).only('id').values_list('id', flat=True)
        else:
            trip_ids = user.trips_as_rider.exclude(
                status=Trip.COMPLETED
            ).only('id').values_list('id', flat=True)
        return map(str, trip_ids)

    async def connect(self):
        user = self.scope['user']
        print('self', self)
        print('user', user)
        if user.is_anonymous:
            await self.close()
        else:
            user_group = await self._get_user_group(user)
            if user_group == 'driver':
                await self.channel_layer.group_add(
                    group='drivers',
                    channel=self.channel_name
                )

            for trip_id in await self._get_trip_ids(user):
                await self.channel_layer.group_add(
                    group=trip_id,
                    channel=self.channel_name
                )

            await self.accept()

    async def disconnect(self, code):
        user = self.scope['user']
        if user.is_anonymous:
            await self.close()
        else:
            user_group = await self._get_user_group(user)
            if user_group == 'driver':
                await self.channel_layer.group_discard(
                    group='drivers',
                    channel=self.channel_name
                )

            for trip_id in await self._get_trip_ids(user):
                await self.channel_layer.group_discard(
                    group=trip_id,
                    channel=self.channel_name
                )

        await super().disconnect(code)

    #These async functions are the handlers for the types
    async def receive_message(self, message):
        await self.send_json(message)

    async def receive_json(self, content, **kwargs):
        print('line 96 content', content)
        message_type = content.get('type')
        if message_type == 'create.trip':
            await self.create_trip(content)
        elif message_type == 'update.trip':
            await self.update_trip(content)
        elif message_type == 'delete.trip':
            await self.delete_trip(content)
        else: 
            await self.receive_message(content)


    async def update_trip(self, message):
        data = message.get('data')
        trip = await self._update_trip(data)
        trip_data = await self._get_trip_data(trip)

        # Add driver to the trip group.
        # await self.channel_layer.group_add(
        #     group=f'{trip.id}',
        #     channel=self.channel_name
        # )

        # Send update to rider.
        await self.channel_layer.group_send(
            group=f'{trip.id}',
            message={
                'type': 'receive.message',
                'data': trip_data,
                'action': 'update',
            }
        )

        await self.send_json({
            'type': 'initiate.message',
            'data': trip_data,
            'action':'update', 
        })

    async def delete_trip(self, message):
        data = message.get('data')
        trip = await self._delete_trip(data)
        trip_data = await self._get_trip_data(trip)

        await self.channel_layer.group_add( 
            group=f'{trip.id}',
            channel=self.channel_name
        )

        await self.channel_layer.group_send(
            group='drivers', 
            message={
            'type': 'receive.message',
            'data': trip_data,
            'action': 'delete',
            },
        )

        await self.send_json({
            'type': 'initiate.message',
            'data': trip_data,
        })

    async def create_trip(self, message):
        data = message.get('data')
        trip = await self._create_trip(data)
        trip_data = await self._get_trip_data(trip)

        # Add rider to trip group.
        await self.channel_layer.group_add(
            group=f'{trip.id}',
            channel=self.channel_name
        )

        # Send rider requests to all drivers.
        await self.channel_layer.group_send(
            group='drivers', 
            message={
            'type': 'receive.message',
            'data': trip_data,
            'action':'create',
            }
        )

        await self.send_json({
            'type': 'initiate.message',
            'data': trip_data,
            'action':'create',
        })

   