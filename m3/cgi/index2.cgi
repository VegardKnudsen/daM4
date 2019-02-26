#!/bin/bash

echo  "Content-type: text/html"
echo 
echo  '<html>'
echo  '<head>'
echo  '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">'
echo  '<title>Form: CGI </title>'
echo  '</head>'
echo  '<body>'
echo  "<form method=GET action=\"${SCRIPT}\">"\
      '<table nowrap>'\
      '<tr><td>TABLE</TD><TD><input type="text" name="table" size=12></td></tr>'\
      '<tr><td>ID</td><td><input type="text" name="id" size=12 value=""></td>'\
      '<tr><td>param1</td><td><input type="text" name="param1" size=12 value=""></td>'\
      '<tr><td>param2</td><td><input type="text" name="param2" size=12 value=""></td>'\
      '<tr><td>param3</td><td><input type="text" name="param3" size=12 value=""></td>'\
      '</tr></table>'

echo  '<input type="radio" name="request" value="GET" checked> Search<br>'\
      '<input type="radio" name="request" value="PUT"> Edit<br>'\
      '<input type="radio" name="request" value="POST"> Add<br>'\
      '<input type="radio" name="request" value="DELETE"> Delete'
echo  '<br><input type="submit" value="Submit">'\
      '<input type="reset" value="Reset"></form>'
 

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
    resp=$(curl --data "authorID=$ID&firstname=$PARAM1&lastname=$PARAM2&nationality=$PARAM3" -X $REQ "http://172.17.0.2:3000/authors")
    #curl --data "param1=value1&param2=value2" http://hostname/resourc
    echo '<br>'
    #echo "curl --data "table=$TABLE&id=$ID&firstname=$PARAM1&lastname=$PARAM2&nationality=$PARAM3" -X $REQ http://172.17.0.2:3000/"
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