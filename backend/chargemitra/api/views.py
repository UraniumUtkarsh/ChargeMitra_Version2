from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.utils.timezone import now
from .models import Charger, Profile, Booking
from .serializers import ChargerSerializer, BookingSerializer


# 🔌 CHARGER VIEWSET
class ChargerViewSet(viewsets.ModelViewSet):
    queryset = Charger.objects.all()
    serializer_class = ChargerSerializer
    permission_classes = [IsAuthenticated]

    # 🔒 Only user's chargers (dashboard)
    def get_queryset(self):
        return Charger.objects.filter(user=self.request.user)

    # 🌍 Public chargers (for map)
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        chargers = Charger.objects.filter(is_active=True)
        serializer = ChargerSerializer(chargers, many=True)
        return Response(serializer.data)

    # ➕ Assign owner automatically
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        start = self.request.data.get("start_time")
        end = self.request.data.get("end_time")
        charger_id = self.request.data.get("charger")

        charger = Charger.objects.get(id=charger_id)

        # ❌ validation: past booking
        if start < str(now()):
            raise Exception("Cannot book past time")

        # ❌ validation: overlap
        overlapping = Booking.objects.filter(
            charger=charger,
            start_time__lt=end,
            end_time__gt=start,
            status__in=['pending', 'confirmed']
        ).exists()

        if overlapping:
            raise Exception("Time slot already booked")

        serializer.save(user=self.request.user)

    # 🔥 OWNER VIEW (incoming requests)
    @action(detail=False, methods=['get'])
    def incoming(self, request):
        chargers = Charger.objects.filter(user=request.user)
        bookings = Booking.objects.filter(charger__in=chargers, status='pending')
        return Response(BookingSerializer(bookings, many=True).data)

    # ✅ ACCEPT
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        booking = Booking.objects.get(id=pk)
        if booking.charger.user != request.user:
            return Response({"error": "Not allowed"}, status=403)

        booking.status = "confirmed"
        booking.save()
        return Response({"message": "Booking confirmed"})

    # ❌ REJECT
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        booking = Booking.objects.get(id=pk)
        if booking.charger.user != request.user:
            return Response({"error": "Not allowed"}, status=403)

        booking.status = "rejected"
        booking.save()
        return Response({"message": "Booking rejected"})


# 👤 REGISTER API
@api_view(['POST'])
def register(request):
    username = request.data.get("username")
    password = request.data.get("password")
    email = request.data.get("email")
    phone = request.data.get("phone")

    # basic validation
    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    # create user
    user = User.objects.create_user(
        username=username,
        password=password,
        email=email
    )

    # create profile with phone
    Profile.objects.create(user=user, phone=phone)

    return Response({"message": "User registered successfully"})