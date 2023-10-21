from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model
from django.shortcuts import render

from .models import Post
from .serializers import UserRegistrationSerializer, PostSerializer


User = get_user_model()


class UserRegistrationAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer

    def create(self,request,*args,**kwargs):
        reponse = super().create(request,*args,**kwargs)
        user = User.objects.get(email=request.data['email'])

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        reponse.data['access_token'] = access_token

        return reponse


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    if request.method == 'POST':
        print("DJANGO REQUEST DATA (CREATE_POST)",request.data) # DEBUG
        post_data = request.data
        post_data['user'] = request.user.id
        serializer = PostSerializer(data=post_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    print("POST VIEWSET")

    def create(self, request, *args, **kwargs):
        if request.method == 'POST':
            print("DJANGO REQUEST DATA (CREATE_POST)",request.data) # DEBUG
            post_data = request.data
            post_data['user'] = request.user.id
            serializer = PostSerializer(data=post_data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)