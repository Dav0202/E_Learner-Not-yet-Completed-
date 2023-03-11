"""
    Serializer For API views
"""
from rest_framework import serializers
from users.models import User
from api.models import Assignment, GradedAssignment, Question, Choice, Material

class StringSerializer(serializers.StringRelatedField):
    """
        class to replace "id" with real values
    """
    def to_internal_value(self, value):
        """
            returns internal value of id
        """
        return value
    

class QuestionSerializer(serializers.ModelSerializer):
    """
        Class to define the Question view serializer
    """
    choices = StringSerializer(many=True)
     
    class Meta:
        """
            class of a serializer class the defines its behavior
        """
        model = Question
        fields = ('id', 'choices', 'question', 'order')

class MaterialSerializer(serializers.ModelSerializer):
    """
    Class to define the Material view serializer
    """
    material = serializers.FileField(allow_empty_file=False)
    uploader = serializers.CharField(source="uploader.email", read_only=True)
    class Meta:
        """
            class of a serializer class the defines its behavior
        """
        model = Material
        fields = ("__all__")
    
    def create(self, request):
        """
            create material from data gotten 
            from request
        """
        data = request.data
        material = Material()
        uploader = User.objects.get(email__exact =data['uploader'])
        material.uploader = uploader
        material.description = data['description']
        material.material = data['material']
        material.save()
        return material
        

class AssignmentSerializer(serializers.ModelSerializer):
    """
    Class to define the Assignment view serializer
    """
    questions = serializers.SerializerMethodField()
    educator = serializers.CharField(source="educator.username", read_only=True)
    class Meta:
        """
            class of a serializer class the defines its behavior
        """
        model = Assignment
        fields = ('__all__')

    def get_questions(self, obj):
        """
            gets "questions" for assignment serializer
        """
        questions =  QuestionSerializer(obj.questions.all(), many=True).data
        return questions

    def create(self, request):
        """
            create assignment from data gotten 
            from request
        """
        data = request.data
        print(data)
        assignment = Assignment()
        educator = User.objects.get(email__exact =data['educator'])
        print(educator)
        assignment.educator = educator
        assignment.title = data['title']
        assignment.classes = data['classes']
        assignment.subject = data['subject']
        assignment.save()

        order = 1
        for q in data['question']:
            newQ = Question()
            newQ.question = q['question']
            newQ.order = order
            newQ.save()

            for c in q['choices']:
                newC = Choice()
                newC.title = c
                newC.save()
                newQ.choices.add(newC)

            newQ.answer = Choice.objects.filter(title = q['answer'])
            newQ.assignment = assignment
            newQ.save()
            order += 1
        return assignment
    
class GradedAssignmentSerializer(serializers.ModelSerializer):
    """
        Class to define the Graded assignment (score) view serializer
    """
    assignment = StringSerializer(many=False)
    student = StringSerializer(many = False)

    class Meta:
        """
            class of a serializer class the defines its behavior
        """
        model = GradedAssignment
        fields = ('__all__')
    
    def create(self, request):
        """
            create graded assignment from data gotten 
            from request
        """
        data = request.data
        print(data)
        assignment = Assignment.objects.get(id=data['id'])
        student = User.objects.get(email__exact= data['email'])

        graded_asnt = GradedAssignment()
        graded_asnt.assignment = assignment
        graded_asnt.student = student

        questions = [q for q in assignment.questions.all()]
        answer = [i for i in data['answers']]
        print(answer)

        answered_correct_count = 0
        for i in range(len(questions)):
            if questions[i].answer.title == answer[i]:
                answered_correct_count +=1
            i +=1 
        grade = answered_correct_count / len(questions) * 100
        graded_asnt.grade = grade
        graded_asnt.save()
        return graded_asnt