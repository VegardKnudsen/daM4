#!/bin/sh
echo "Content-type:text/html;charset=utf-8"
echo

read BODY

cat << EOF
<!doctype html>
<html>
 <head>
  <meta charset='utf-8'>
  <title>MP4</title>
 </head>
 <body>

  <form action="http://localhost:9000/books/all" method='get'>
    <input type=submit name='fetchAllBooks' value='Get all books'>
  </form> 
  <br>
  <form action="http://localhost:9000/authors/all" method='get'>
    <input type=submit name='fetchAllAuthors' value='Get all authors'>
  </form> 
  <br>
  <form method='get'>
    <p>Enter id:</p>
    <input type=text name=id>
    <p>Enter table:</p>
    <input name=tablename>
    <br>	
    <input label="Table name:" type=submit name='getEntryById' value='Get'>
 </form> 
 </body>
</html>  
EOF

extractedTable=$(echo $QUERY_STRING | awk -F'[=&]' {'print $4'})
extractedId=$(echo $QUERY_STRING | awk -F'[=&]' {'print $2'})

request="$REQUEST_METHOD /$extractedTable/$extractedId HTTP/1.1"

echo "$request"

resp=$(curl -X GET http://localhost:9000/$extractedTable/$extractedId)

echo "$resp"
