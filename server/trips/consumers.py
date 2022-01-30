from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from trips.serializers import NestedTripSerializer, TripSerializer

from trips.models import Trip

class TaxiConsumer(AsyncJsonWebsocketConsumer):

    #Verify data and create new trip record
    @database_sync_to_async
    def _create_trip(self, data):
        serializer = TripSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer.create(serializer.validated_data)

    #Quick and simple, delete trip record.
    @database_sync_to_async
    def _delete_trip(self, data):
        Trip.objects.get(id=data.get('id')).delete()

    #Verify data and then update database.
    @database_sync_to_async
    def _update_trip(self, data):
        instance = Trip.objects.get(id=data.get('id'))
        serializer = TripSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer.update(instance, serializer.validated_data)

    #Get the serialized data of the trip
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

    #Check if the user is logged in, if they are then associate them with a channel and a group.
    async def connect(self):
        user = self.scope['user']
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

    #Upon disconnection remove the users from their associated channels and groups.
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

    #Once the connection is made the websocket can receive messages. The received messages go through this function which checks
    #what type of operation is desired.
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

    #These async functions are the handlers for the types
    async def receive_message(self, message):
        await self.send_json(message)

    async def update_trip(self, message):
        #First get the data property from the message
        data = message.get('data')
        #Then update the trip with the up to date data
        trip = await self._update_trip(data)
        #Next get the full data of the trip from the database
        trip_data = await self._get_trip_data(trip)

        #Add the channel of the current driver to the trip group which includes the associated rider
        await self.channel_layer.group_add(
            group=f'{trip.id}',
            channel=self.channel_name
        )

        # Send update to everyone in the trip group.
        await self.channel_layer.group_send(
            group=f'{trip.id}',
            message={
                'type': 'receive.message',
                'data': trip_data,
                'action': 'update',
            }
        )

        # Delete the request from every other drivers dashboard. In the client we filter out the driver associated with the trip.
        await self.channel_layer.group_send(
            group='drivers', 
            message={
            'type': 'receive.message',
            'data':trip_data,
            'action': 'delete',
            },
        )

    async def delete_trip(self, message):
        #Get the data property from the message
        data = message.get('data')
        #Delete the trip from the database
        await self._delete_trip(data)
        #No need to serialize received data because the client should send back complete data and we do not need to verify 
        #that the data is in the correct format because we are simply deleting the record, not creating or updating.

        #Delete the trip from every drivers dashboard
        await self.channel_layer.group_send(
            group='drivers', 
            message={
            'type': 'receive.message',
            #Send data back instead of the serialized data, 
            # because we already have access to all of the attributes we need for the client.
            'data': data,
            'action': 'delete',
            'sender': 'rider',
            },
        )

        #Send data back to the rider to initiate optimistic update on client.
        await self.send_json({
            'type': 'initiate.message',
            'data': data
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

        # Send rider requests to all drivers and update their trips cache.
        await self.channel_layer.group_send(
            group='drivers', 
            message={
            'type': 'receive.message',
            'data': trip_data,
            'action':'create',
            }
        )

        #Need to send data back to the rider to update their state. In this case we perform a pessimistic update.
        await self.send_json({
            'type': 'initiate.message',
            'data': trip_data,
            'action':'create',
        })

   