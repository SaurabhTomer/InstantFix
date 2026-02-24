








#ADMIN ROLE

1) approve electrician
electricianId > role check > approval status check  > then approve request > socket emit event  > mail send > response send

2) reject electrician
electricianId > role check > approval status check  > then reject request > socket emit event  > mail send > response send


3) get pending request
 page , limit , skip  > filter with role and pending status > store electrician and total request > response


4) get all electrician 
  page , limit , skip  > quesy comes in query request > filter with role > store electrician and total request > response


5) get Electrician details


