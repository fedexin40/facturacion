FROM python:3.12

# set work directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copy proyect
COPY . .

# install dependencies
RUN pip install --upgrade pip
RUN pip install poetry
RUN poetry config virtualenvs.create false --local
RUN poetry install

EXPOSE 9010
CMD [ "python", "./manage.py", "runserver", "0.0.0.0:9010"]

