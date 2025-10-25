from django.utils.deprecation import MiddlewareMixin

class CaptureSessionMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if not request.session.session_key:
            request.session.create()