from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from django.contrib.auth import get_user_model
from django.shortcuts import render

from .models import Post, Like, Comment, Follower
from .serializers import UserRegistrationSerializer, PostSerializer, CommentSerializer, CustomTokenObtainPairSerializer, FollowerSerializer, UserSerializer


User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = FollowerSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'username'

    @action(detail=True, methods=['POST'], url_path='follow', url_name='follow_user')
    def follow(self, request, pk=None, *args, **kwargs):
        current_user = request.user
        user_to_follow = self.get_object()

        if user_to_follow == current_user:
            return Response({'message': 'You cannot follow yourself!'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            existing_follow = Follower.objects.get(follower=current_user, following=user_to_follow)
        except Follower.DoesNotExist:
            existing_follow = None
        
        if existing_follow:
            existing_follow.delete()
            return Response({'message': 'User unfollowed!'}, status=status.HTTP_200_OK)
        
        Follower.objects.create(follower=current_user, following=user_to_follow)
        return Response({'message': 'User followed!'}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['GET'], url_path='followers', url_name='user_followers')
    def user_followers(self, request, *args, **kwargs):
        user = self.get_object()
        followers = [f.following for f in user.following.all()]
        serializer = UserSerializer(followers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class UserRegistrationAPIView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        reponse = super().create(request, *args, **kwargs)
        user = User.objects.get(email=request.data['email'])

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        reponse.data['access_token'] = access_token

        return reponse


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # Post Actions
    @action(detail=True, methods=['PUT'], url_path='edit', url_name='edit_post')
    def edit_post(self, request, pk=None):
        try:
            post = self.get_object()
            serializer = PostSerializer(post, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response({'message': 'Post does not exist!'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['DELETE'], url_path='delete', url_name='delete_post')
    def delete_post(self, request, pk=None):
        try:
            post = self.get_object()
            post.delete()
            return Response({'message': 'Post deleted!'}, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({'message': 'Post does not exist!'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['POST'], url_path='like', url_name='like_post')
    def like_post(self, request, pk=None):
        try:
            post = self.get_object()
            like, created = Like.objects.get_or_create(
                user=request.user, post=post)
            if created:
                post.likes_count += 1
                post.save()
                return Response({'message': 'Post liked!'}, status=status.HTTP_201_CREATED)
            else:
                post.likes_count = max(0, post.likes_count - 1)
                post.save()
                like.delete()
                return Response({'message': 'Post unliked!'}, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({'message': 'Post does not exist!'}, status=status.HTTP_404_NOT_FOUND)

    # Comment Actions
    @action(detail=True, methods=['GET'], url_path='comments', url_name='post_comments')
    def post_comments(self, request, pk=None):
        post = self.get_object()
        comments = Comment.objects.filter(post=post)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['POST'], url_path='comment', url_name='comment_post')
    def comment_post(self, request, pk=None):
        post = self.get_object()
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, post=post)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # optional method to get nested comments
    @action(detail=True, methods=['GET'], url_path='comment/(?P<comment_id>\d+)', url_name='nested_comments')
    def nested_comments(self, request, pk=None, comment_id=None):
        parent_comment = Comment.objects.get(id=comment_id)
        nested_comments = Comment.objects.filter(parent_comment=parent_comment)
        serializer = CommentSerializer(nested_comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
