#!/bin/bash
cd /seedbot/DXUtil

while true;
do
	npm start | tee "log/$(date +%s).log" | sed -r "s/\x1B\[([0-9]{1,3}(;[0-9]{1,2})?)?[mGK]//g"
done

#npm start > /seedbot/stable.log 2>&1
