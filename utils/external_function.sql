ALTER function ANALYTICS.PUBLIC."__snowsend-36f777c"(string, variant)
 set REQUEST_TRANSLATOR = analytics.public._req_translator;

SELECT ANALYTICS.PUBLIC."__snowsend-36f777c"('test',PARSE_JSON('{"subject": "Welcome to our service!"}'));