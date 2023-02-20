from rest_framework import serializers
from users.models import User
from api.models import Assignment, GradedAssignment, Question, Choice, Material

class StringSerializer(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value
    
class MaterialSerializer(serializers.ModelSerializer):
    material = serializers.FileField(allow_empty_file=False)
    class Meta:
        model = Material
        fields = ("__all__")

class QuestionSerializer(serializers.ModelSerializer):
    choices = StringSerializer(many=True)
     
    class Meta:
        model = Question
        fields = ('id', 'choices', 'question', 'order')

class AssignmentSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()
    educators = StringSerializer(many=False)
    class Meta:
        model = Assignment
        fields = ('__all__')

    def get_questions(self, obj):
        questions =  QuestionSerializer(obj.questions.all(), many=True).data
        return questions

    def create(self, request):
        data = request.data
        print(data)
        assignment = Assignment()
        educator = User.objects.get(id =data['educator'])
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

            newQ.answer = Choice.objects.get(title = q['answer'])
            newQ.assignment = assignment
            newQ.save()
            order += 1
        return assignment
    
class GradedAssignmentSerializer(serializers.ModelSerializer):
    assignment = StringSerializer(many=False)
    student = StringSerializer(many = False)

    class Meta:
        model = GradedAssignment
        fields = ('__all__')
    
    def create(self, request):
        data = request.data
        print(data)
        assignment = Assignment.objects.get(id=data['id'])
        student = User.objects.get(username= data['username'])

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