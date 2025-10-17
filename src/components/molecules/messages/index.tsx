import { Card, Input, Message } from '@/components/atoms'
import React from 'react'


const example = [
    {
        name: 'Julian Chidi',
        textmessage: 'Hey! Did you finish the you finish the wireframe for the mobile app design?',
        day: 'Today',
        time: '6:30 PM'
    },
    {
        name: 'Julian Chidi',
        textmessage: 'Hey! Did you finish the you finish the wireframe for the mobile app design?',
        day: 'Today',
        time: '6:30 PM'
    },
    {
        name: 'Julian Chidi',
        textmessage: 'Hey! Did you finish the you finish the wireframe for the mobile app design?',
        day: 'Today',
        time: '6:30 PM'
    },
    {
        name: 'Julian Chidi',
        textmessage: 'Hey! Did you finish the you finish the wireframe for the mobile app design?',
        day: 'Today',
        time: '6:30 PM'
    },
    {
        name: 'Julian Chidi',
        textmessage: 'Hey! Did you finish the you finish the wireframe for the mobile app design?',
        day: 'Today',
        time: '6:30 PM'
    },
    {
        name: 'Julian Chidi',
        textmessage: 'Hey! Did you finish the you finish the wireframe for the mobile app design?',
        day: 'Today',
        time: '6:30 PM'
    },
    {
        name: 'Julian Chidi',
        textmessage: 'Hey! Did you finish the you finish the wireframe for the mobile app design?',
        day: 'Today',
        time: '6:30 PM'
    },
    {
        name: 'Julian Chidi',
        textmessage: 'Hey! Did you finish the you finish the wireframe for the mobile app design?',
        day: 'Today',
        time: '6:30 PM'
    },
]
export const Messages = () => {
    return (
        <div>
            <Card className=''>
                <div className='p-6'>
                    <p>Messages</p>
                </div>
                <hr />
                <div className='p-6 space-y-3'>
                    <div className='flex justify-center items-center gap-3'>
                        <p>All messages</p>
                        <div className='h-5 w-0.5 bg-ring'></div>
                        <p><span>5</span> running projects</p>
                    </div>
                    <Input className='bg-primary/20' placeholder='Search or start a new chat' />
                </div>
                {example.map((n, idx) => (
                    <div key={idx}>
                        <Message props={{
                            name: n.name,
                            textmessage: n.textmessage,
                            day: n.day,
                            time: n.time
                        }} />
                        <hr/>
                    </div>
                ))}
            </Card>
        </div>
    )
}
