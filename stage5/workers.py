# Asynchronous Fan-Out
# Decouple the process using a Message Broker (RabbitMQ)

def trigger_mass_notify(student_ids, msg):
    job_id = db.create_job()
    broker.publish("notify_bulk", {"job": job_id, "users": student_ids, "msg": msg})
    return {"status": "processing", "job_id": job_id}

def handle_bulk_event(payload):
    users = payload["users"]
    db.bulk_insert(users, payload["msg"])
    pubsub.emit("realtime", users)
    
    for batch in chunk(users, 1000):
        broker.publish("emails", batch)
