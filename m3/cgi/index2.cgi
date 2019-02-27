#!/bin/bash

echo  "Content-type: text/html"
echo 
echo '<html>'\
     '<head>'\
     '<style>'\
    '		form {'\
    '  			border: 3px solid #f1f1f1;'\
    '		}'\
    '		h1{'\
    '  			color: #4f92ff;'\
    '		}'\
    '		button {'\
    '			background-color: #4f92ff;'\
    '			color: white;'\
    '			padding: 15px 32px;'\
    '			text-align: center;'\
    '			display: inline-block;'\
    '			font-size: 16px;'\
    '			margin: 8px 0;'\
    '			cursor: pointer;'\
    '		}'\
    '		input{'\
    '			background-color: #e8f0ff;'\
    '		}'\
    '	</style>'\
    '</head>'\
    \
    '<body>'\
    '	<h1>'\
    '		GUTTA LEVERER BIBBBLIOTEKKK SI'\
    '	</h1>'\
    ' <form action="action_page.php">'\
    '  <div class="container">'\
    '    <input type="text" placeholder="Username" name="uname" required>'\
    '    <input type="password" placeholder="Password" name="psw" required>'\
    '    <button type="login">Login</button>'\
    '  </div>'\
    '</form>'
echo " <form method=GET action=\"${SCRIPT}\">"\
    '  	<select name=table>'\
    '  		<option value="authors">Authors</option>'\
    '  		<option value="books">Books</option>'\
    '  	</select><br><br>'\
    '  <input type="text" placeholder="ID" name="id"><br>'\
    '  <input type="radio" name="request" value="GET" checked> Search<br>'\
    '  <input type="radio" name="request" value="POST"> Edit<br>'\
    '  <input type="radio" name="request" value="PUT"> Add<br>'\
    '  <input type="radio" name="request" value="DELETE"> Delete<br>'\
    '  <button type="submit">Submit</button>'\
    '</form>'\
    '</body>'\
    '</html>'
 

if [ -z "$QUERY_STRING" ] ; then
  exit 0
else

  TABLE=`echo "$QUERY_STRING" | sed -n 's/^.*table=\([^&]*\).*$/\1/p' | sed "s/%20/ /g"`
  ID=`echo "$QUERY_STRING" | sed -n 's/^.*id=\([^&]*\).*$/\1/p' | sed "s/%20/ /g"`
  REQ=`echo "$QUERY_STRING" | sed -n 's/^.*request=\([^&]*\).*$/\1/p' | sed "s/%20/ /g"`
  PARAM1=`echo "$QUERY_STRING" | sed -n 's/^.*param1=\([^&]*\).*$/\1/p' | sed "s/%20/ /g"`
  PARAM2=`echo "$QUERY_STRING" | sed -n 's/^.*param2=\([^&]*\).*$/\1/p' | sed "s/%20/ /g"`
  PARAM3=`echo "$QUERY_STRING" | sed -n 's/^.*param3=\([^&]*\).*$/\1/p' | sed "s/%20/ /g"`

  echo '<br>'
  echo "table: " $TABLE
  echo '<br>'
  echo "id: " $ID
  echo '<br>'
  echo "request: " $REQ
  echo "testing for space"
  echo '<br>'
  
  if [[ "$REQ" == *"GET"* ]] ; then
    echo "req is get"
    resp=$(curl --request $REQ "http://172.17.0.2:3000/$TABLE/$ID")
    echo '<br>'
    echo "curl --request $REQ http://172.17.0.2:3000/$TABLE/$ID"
    echo '<br>'
  fi

  if [[ "$REQ" == *"POST"* ]] ; then
    echo "req is post"
    if [[ "$TABLE" == *"authors"* ]] ; then
      resp=$(curl --data "authorID=$ID&firstname=$PARAM1&lastname=$PARAM2&nationality=$PARAM3" -X $REQ "http://172.17.0.2:3000/authors")
    elif [[ "$TABLE" == *"books"* ]] ; then
      resp=$(curl --data "bookID=$ID&booktitle=$PARAM1&authorID=$PARAM2" -X $REQ "http://172.17.0.2:3000/books")
    else
      echo "Table name incorrect!"
    fi
    echo '<br>'
  else
    echo "not post"
  fi
  echo '<br>'
  echo $resp
  echo '<br>'
fi
echo '</body>'
echo '</html>'
 
exit 0