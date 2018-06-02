## create a ballot

curl -d '{"type":"CREATE_BALLOT", "payload": {"question": "Should I mock the database or do the full integration?", "options": ["Just the request", "Full integration"]}}' -H "Content-Type: application/json" -X POST http://localhost:3000/command

## cast a ballot

curl -d '{"aggregateId": "ca66cdb3-05fb-4b97-8e2c-62cfc6cbd296", "type":"CAST_BALLOT", "payload": {"selectedOptions": ["cyan"]}}' -H "Content-Type: application/json" -X POST http://localhost:3000/command
