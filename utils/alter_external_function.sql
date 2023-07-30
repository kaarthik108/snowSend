ALTER FUNCTION ANALYTICS.PUBLIC."{{ func_name }}"(string, variant)
 SET REQUEST_TRANSLATOR = analytics.public.{{ translator_func_name }};

SELECT ANALYTICS.PUBLIC."{{ func_name }}"('test',PARSE_JSON('{"subject": "Welcome to our service!"}'));
