#!/bin/bash

if [ "$REQUEST_METHOD" = "POST" ] ; then
  if [ "$CONTENT_LENGTH" -gt 0 ] ; then
      read -n $CONTENT_LENGTH POST_BODY <&0
  fi
fi

ACTION_TYPE=$(echo $POST_BODY | awk -F "request=" '{print $2}')

if [ "$ACTION_TYPE" = "LOGIN" ] ; then 
  USER_ID=$(echo $POST_BODY | awk -F'[=&]' {'print $2'})
  PASSWORD=$(echo $POST_BODY | awk -F'[=&]' {'print $4'})
  
  XML_CONTENT="<logininfo><userid>$USER_ID</userid><passwordhash>$PASSWORD</passwordhash></logininfo>"
  RESPONSE=$(curl -i --request POST --cookie "$HTTP_COOKIE" --url "http://172.17.0.2:3000/login" --header 'content-type: text/xml' --data "$XML_CONTENT" | grep Cookie)
  #RESP=$(curl -i --request POST --url "http://172.17.0.2:3000/login" --header 'content-type: text/xml' --data "$XML_CONTENT")
  
  COOKIE=$(echo "$RESPONSE" | awk -F'[:;]' {'print $2'})
        
  echo "Set-cookie:$COOKIE"        
fi

if [ "$ACTION_TYPE" = "LOGOUT" ] ; then
  #SESSION_ID=$(echo $HTTP_COOKIE | awk -F'[=&]' {'print $2'})
  #XML_CONTENT="<logoutinfo><sessionid>$SESSION_ID</sessionid></logoutinfo>"

  RESPONSE=$(curl --request DELETE --cookie "$HTTP_COOKIE" --url "http://172.17.0.2:3000/logout")

  #COOKIE=$(echo "$RESPONSE" | awk -F'[:;]' {'print $2'})
        
  #echo "Set-cookie:$COOKIE" 
fi

  echo "Content-type:text/html;charset=utf-8"
  echo 


cat << EOF
<!doctype html>
<html>
<head>
<title>CGI: Form</title>
<style>
	form {
  			border: 3px solid #f1f1f1;
		}
		h1{
  			color: #4f92ff;
		}
    h4{
        color: #4f92ff;
    }
    h5{
        color: #4f92ff;
    }
		button {
			background-color: #4f92ff;
			color: white;
			padding: 15px 32px;
			text-align: center;
			display: inline-block;
			font-size: 16px;
			margin: 8px 0;
			cursor: pointer;
		}
		input{
			background-color: #e8f0ff;
		}
	</style>
</head>
<body>
	<h1>Biblioteket</h1>
  <h4>Baklien, Knudsen, Lundberg og Steinsto AS</h4> 
 
 <form method=POST>
  <div class="container">
    <input type="text" placeholder="Username" name="uname">
    <input type="password" placeholder="Password" name="psw">
    <button type="submit" name="request" value="LOGIN">Login</button>
    <button type="submit" name="request" value="LOGOUT">Logout</button>
  </div>
</form>

<form method=GET>
    <h4>Search</h4>
    <select name=table>
      <option value="authors">Authors</option>
      <option value="books">Books</option>
    </select><br><br>
  <input type="text" placeholder="ID" name="id"><br>
  <button type="submit" name="action" value="GET">Submit</button>
</form>

<form method=POST>
  	<select name=table>
  		<option value="authors">Authors</option>
  		<option value="books">Books</option>
  	</select><br><br>
  <input type="text" placeholder="ID" name="id"><br>
  <input type="text" placeholder="Parameter 1" name="param1"><br>
  <input type="text" placeholder="Parameter 2" name="param2"><br>
  <input type="text" placeholder="Parameter 3" name="param3"><br>
  <input type="radio" name="action" value="PUT"> Edit<br>
  <input type="radio" name="action" value="POST"> Add<br>
  <input type="radio" name="action" value="DELETE"> Delete<br>
  <button type="submit">Submit</button>
</form>
</body>
</html>
EOF

#/usr/bin/env
#echo $POST_BODY
#echo $HTTP_COOKIE

#SESSION_ID=$(echo $HTTP_COOKIE | awk -F'[=&]' {'print $2'})
#echo $SESSION_ID



ACTION_TYPE=$(echo $POST_BODY | awk -F "action=" '{print $2}')
echo $ACTION_TYPE
if [ "$ACTION_TYPE" == *"GET"* ] ; then 
    resp=$(curl --request $REQ "http://172.17.0.2:3000/$TABLE/$ID")
    echo '<br>'
fi

  TABLE=$(echo $POST_BODY | awk -F'[=&]' {'print $2'})
  ID=$(echo $POST_BODY | awk -F'[=&]' {'print $4'})
  PARAM1=$(echo $POST_BODY | awk -F'[=&]' {'print $6'})
  PARAM2=$(echo $POST_BODY | awk -F'[=&]' {'print $8'})
  PARAM3=$(echo $POST_BODY | awk -F'[=&]' {'print $10'})

  if [[ "$REQ" == *"POST"* ]] ; then
    if [[ "$TABLE" == *"authors"* ]] ; then
      XML_CONTENT="<userinput><authorID>$ID</authorID><firstname>$PARAM1</firstname><lastname>$PARAM2</lastname><nationality>$PARAM3</nationality></userinput>"
      resp=$(curl --request POST --cookie "$HTTP_COOKIE" --url "http://172.17.0.2:3000/authors" --header 'cache-control: no-cache' --header 'content-type: text/xml' --data "$XML_CONTENT")
    elif [[ "$TABLE" == *"books"* ]] ; then
      XML_CONTENT="<userinput><bookID>$ID</bookID><booktitle>$PARAM1</booktitle><authorID>$PARAM2</authorID></userinput>"
      resp=$(curl --request POST --cookie "$HTTP_COOKIE" --url "http://172.17.0.2:3000/books" --header 'cache-control: no-cache' --header 'content-type: text/xml' --data "$XML_CONTENT")
    fi
    echo '<br>'
  fi

  if [[ "$REQ" == *"PUT"* ]] ; then
    if [[ "$TABLE" == *"authors"* ]] ; then
      XML_CONTENT="<userinput><authorID>$ID</authorID><firstname>$PARAM1</firstname><lastname>$PARAM2</lastname><nationality>$PARAM3</nationality></userinput>"
      resp=$(curl --request POST --cookie "$HTTP_COOKIE" --url "http://172.17.0.2:3000/authors" --header 'cache-control: no-cache' --header 'content-type: text/xml' --data "$XML_CONTENT")
    elif [[ "$TABLE" == *"books"* ]] ; then
      XML_CONTENT="<userinput><bookID>$ID</bookID><booktitle>$PARAM1</booktitle><authorID>$PARAM2</authorID></userinput>"
      resp=$(curl --request POST --cookie "$HTTP_COOKIE" --url "http://172.17.0.2:3000/books" --header 'cache-control: no-cache' --header 'content-type: text/xml' --data "$XML_CONTENT")
    else
      echo "Table name incorrect!"
    fi
    echo '<br>'
  fi

  if [[ "$REQ" == *"DELETE"* ]] ; then
    if [[ "$TABLE" == *"authors"* ]] ; then
      resp=$(curl --data "authorID=$ID" -X $REQ "http://172.17.0.2:3000/authors")
    elif [[ "$TABLE" == *"books"* ]] ; then
      resp=$(curl --data "bookID=$ID" -X $REQ "http://172.17.0.2:3000/books")
    else
      echo "WRONG!"
    fi
    echo '<br>'
  fi

  echo '<br>'
  echo $resp
  echo '<br>'
