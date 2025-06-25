import mqtt, { KeepaliveManager } from 'mqtt'

const options = {
    clientId : `demo_mqtt_` + Math.random().toString(16).substring(2 , 8),
    Keepalive : 60,
    clean : true
}


const client = mqtt.connect('ws://localhost:9001' , options)

export default client