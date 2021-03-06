from django.contrib.auth.models import User, Group
from rest_framework import serializers

# import model from models.py 
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class InstructorSerializer(serializers.ModelSerializer): 
    # specify model and fields 
    class Meta: 
        model = Instructor
        fields = ['id', 'first_name', 'last_name', 'phone', 'office', 'email']

class CourseSerializer(serializers.ModelSerializer): 
    # specify model and fields 
    class Meta: 
        model = Course
        fields = ['id', 'instructor', 'code', 'name', 'description', 'hours', 'calendar_ref', 'exam_policy', 'calc_policy', 'course_policy']

class LearningOutcomeSerializer(serializers.ModelSerializer): 
    # specify model and fields 
    class Meta: 
        model = LearningOutcome
        fields = ['id', 'course_id', 'description', 'gradAttribute', 'instLevel']

class TimetableSerializer(serializers.ModelSerializer): 
    # specify model and fields 
    class Meta: 
        model = Timetable
        fields = ['id', 'course_id', 'section', 'section_type', 'day1', 'day2', 'start_time', 'end_time', 'location', 'hoursPerWeek', 'studentsPerInstructor']

class CourseInstructorSerializer(serializers.ModelSerializer): 
    # specify model and fields 
    class Meta: 
        model = CourseInstructor
        fields = ['id', 'course_id', 'instructor_type', 'first_name', 'last_name', 'phone', 'office', 'email']

class GradeComponentSerializer(serializers.ModelSerializer): 
    # specify model and fields 
    class Meta: 
        model = GradeComponent
        fields = ['id', 'course_id', 'component', 'learningOutcomes', 'weight']

class TextbookSerializer(serializers.ModelSerializer): 
    # specify model and fields 
    class Meta: 
        model = Textbook
        fields = ['id', 'course_id', 'title', 'authors', 'edition', 'year', 'publisher', 'is_recommended']

class GradeBreakdownSerializer(serializers.ModelSerializer): 
    # specify model and fields 
    class Meta: 
        model = GradeBreakdown
        fields = ['id', 'course_id', 'ap', 'an', 'am', 'bp', 'bn', 'bm', 'cp', 'cn', 'cm', 'dp', 'dn' ] 
