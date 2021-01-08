FROM python:3.8-slim



#RUN apk add --update --no-cache python3 python3-dev py3-pip g++
#
#RUN echo "http://dl-cdn.alpinelinux.org/alpine/v3.5/community" >> /etc/apk/repositories \
#  && apk update \
#  && apk add --update-cache --no-cache libgcc libquadmath musl \
#  && apk add --update-cache --no-cache libgfortran \
#  && apk add --update-cache --no-cache lapack-dev
#
#RUN echo "@community http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
#&& apk add py3-pandas@community py3-numpy@community

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY load_data.py .
COPY data.csv .

CMD [ "python", "./load_data.py" ]