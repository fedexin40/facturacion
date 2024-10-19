from django.contrib import admin

from .models import Company
from .models import Saleor
from .models import Pac
from .models import Smtp

admin.site.register(Company)
admin.site.register(Saleor)
admin.site.register(Pac)
admin.site.register(Smtp)