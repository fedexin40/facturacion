from django.db import models
from django.core.exceptions import ValidationError
from django.utils.timezone import now

class Saleor(models.Model):
    saleor_api = models.CharField(
        verbose_name = "Saleor API URL"
    )
    username = models.CharField(
        verbose_name = "Saleor user name"
    )
    password = models.CharField(
        verbose_name = "Saleor password"
    )

    def save(self, *args, **kwargs):
        """
        Create only one Saleor instance
        """
        if not self.pk and Saleor.objects.exists():
            # This below line will render error by breaking page, you will see
            raise ValidationError(
                "No es posible tener dos instancias de saleor"
            )

            # OR you can ever return None from here, 
            # this will not save any data only you can update existing once
            return None

        return super(Saleor, self).save(*args, **kwargs)

class Company(models.Model):
    rfc = models.CharField(
        verbose_name = "RFC"
    )
    name = models.CharField(
        verbose_name = "Nombre del emisor"
    )
    zip = models.IntegerField(
        verbose_name = "Postal Code"
    )
    certificate = models.FileField(
        verbose_name = "This is the CSD certificate for singing the invoices"
    )
    certificate_key = models.FileField(
        verbose_name = "This is the CSD key for singing the invoices"
    )
    password = models.CharField(
        verbose_name = "Certificate password"
    )

    def save(self, *args, **kwargs):
        """
        Create only one Company instance
        """
        if not self.pk and Company.objects.exists():
            # This below line will render error by breaking page, you will see
            raise ValidationError(
                "No es posible tener dos compañias"
            )

            # OR you can ever return None from here, 
            # this will not save any data only you can update existing once
            return None

        return super(Company, self).save(*args, **kwargs)

class Users(models.Model):
    rfc = models.CharField(primary_key=True, max_length=255)
    name = models.CharField(max_length=255, default='')
    zip = models.IntegerField()

class Invoices(models.Model):
  invoice_number = models.CharField(max_length=255)
  order_number = models.CharField(max_length=255)
  folio = models.IntegerField(default=0)
  created_at = models.DateTimeField(default=now)
  invoice_xml = models.FileField(
      verbose_name = "This is the xml invoice", default=''
  )
  invoice_pdf = models.FileField(
      verbose_name = "This is the PDF invoice", default=''
  )
  user = models.ForeignKey(Users, on_delete=models.CASCADE)

  class Meta:
      ordering = ["-created_at"]
  

class Pac(models.Model):
    user = models.CharField(
        max_length=255
    )
    password = models.CharField(
        max_length=255
    )
    url_sign = models.CharField(
        verbose_name="URL used to sign invoice"
    )

    def save(self, *args, **kwargs):
        """
        Create only one Pac instance
        """
        if not self.pk and Pac.objects.exists():
            # This below line will render error by breaking page, you will see
            raise ValidationError(
                "No es posible tener dos Pacs"
            )

            # OR you can ever return None from here, 
            # this will not save any data only you can update existing once
            return None

        return super(Pac, self).save(*args, **kwargs)
    
class Smtp(models.Model):
    user = models.CharField(
      max_length=255
    )
    password = models.CharField(
      max_length=255
    )
    server = models.CharField(
      verbose_name="Server name"
    )
    port = models.IntegerField(
      verbose_name="Port number"
    )

    def save(self, *args, **kwargs):
        """
        Create only one Pac instance
        """
        if not self.pk and Smtp.objects.exists():
            # This below line will render error by breaking page, you will see
            raise ValidationError(
                "No es posible tener dos Pacs"
            )

            # OR you can ever return None from here, 
            # this will not save any data only you can update existing once
            return None

        return super(Smtp, self).save(*args, **kwargs)