import mqttClient from '@/lib/mqttClient'
import { NextRequest, NextResponse } from 'next/server';

export async function POST(params:NextRequest) {
     const {topic , message} = await params.json();

     mqttClient.publish(topic , message , {} , (err) => {
        if(err){
            return NextResponse.json({
                message : err
            })
        }
     })

     return NextResponse.json({
        message : "message is published on websocket"
     })
}