


'use client'
import { Card, Input, Message, RunningProjects } from '@/components/atoms'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Star } from 'lucide-react'
import React, { useState } from 'react'

type MessageData = {
    name: string
    textmessage: string
    day: string
    time: string
    pinned?: boolean
}

type MessagesProps = {
    messages: MessageData[]
    projects: MessageData[]
    projectCount: number
    onSearch?: (query: string) => void
}

export const Messages = ({
    messages,
    projects,
    projectCount,
    onSearch
}: MessagesProps
) => {
    const [activeTab, setActiveTab] = useState<'messages' | 'projects'>('messages')
    const [searchQuery, setSearchQuery] = useState('')
    const [data, setData] = useState(messages)

    const togglePin = (index: number) => {
        const updated = [...data]
        updated[index].pinned = !updated[index].pinned
        updated.sort((a, b) => Number(b.pinned) - Number(a.pinned))
        setData(updated)
    }

    const handleSearch = () => {
        if (onSearch) onSearch(searchQuery)
    }
    return (
        <div className='font-sans'>
            <Card className=''>
                <div className='p-6'>
                    <p className='text-[24px] font-semibold'>Messages</p>
                </div>
                <hr />
                <div className='p-6 space-y-3 font-sans'>
                    <div className='flex justify-center items-center gap-3 text-[14px]'>
                        <button
                            // onClick={() => setActiveTab('messages')}
                            onClick={() => {
                                console.log('switching tab')
                                setActiveTab('projects')
                            }}
                            className={cn(
                                'font-semibold transition-colors hover:cursor-pointer',
                                activeTab === 'messages' ? 'text-foreground' : 'text-ring'
                            )}
                        >
                            All messages
                        </button>
                        <div className='h-5 w-[0.3px] bg-ring'></div>
                        <button
                            // onClick={() => setActiveTab('projects')}
                            onClick={() => {
                                console.log('switching tab')
                                setActiveTab('projects')
                            }}
                            className={cn(
                                'flex gap-1 font-semibold items-center transition-colors hover:cursor-pointer',
                                activeTab === 'projects' ? 'text-foreground' : 'text-ring'
                            )}
                        >
                            <span className='text-[20px] font-bold'>{projectCount}</span> running projects
                        </button>
                    </div>
                    <div className='relative'>
                        <Search
                            onClick={handleSearch}
                            className='absolute left-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer transition-transform duration-150 hover:scale-110'
                            size={18}
                        />
                        <Input
                            className='pl-10 bg-primary/20 placeholder:text-primary'
                            placeholder='Search or start a new chat'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <hr />
                <div className='max-h-[350px] overflow-y-auto custom-scroll scrollbar-thin scrollbar-thumb-primary/60 scrollbar-track-transparent'>
                    <AnimatePresence initial={false}>
                        {activeTab === 'messages' ? (
                            data.map((n, idx) => (
                                <motion.div
                                    key={idx}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <Message
                                        props={{
                                            name: n.name,
                                            textmessage: n.textmessage,
                                            day: n.day,
                                            time: n.time
                                        }}
                                    >
                                        <Star
                                            onClick={() => togglePin(idx)}
                                            className={cn(
                                                'cursor-pointer transition-transform duration-150 hover:scale-110',
                                                n.pinned ? 'text-primary fill-primary' : 'text-ring'
                                            )}
                                            size={16}
                                        />
                                    </Message>
                                    <hr className=' -mx-6 w[calc(100%+3rem)]' />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                key='projects'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <RunningProjects projects={projects} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Card>

        </div>
    )
}












// 'use client'

// import { Card, Input, RunningProjects } from '@/components/atoms'
// import React, { useState } from 'react'
// import { Search, Star } from 'lucide-react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { cn } from '@/lib/utils'
// import { Message } from '@/components/atoms'

// type MessageData = {
//   name: string
//   textmessage: string
//   day: string
//   time: string
//   pinned?: boolean
// }

// type MessagesProps = {
//   messages: MessageData[]
//   projects: MessageData[]
//   projectCount: number
//   onSearch?: (query: string) => void
// }

// export const Messages = ({
//   messages,
//   projects,
//   projectCount,
//   onSearch
// }: MessagesProps) => {
//   const [activeTab, setActiveTab] = useState<'messages' | 'projects'>('messages')
//   const [searchQuery, setSearchQuery] = useState('')
//   const [data, setData] = useState(messages)

//   const togglePin = (index: number) => {
//     const updated = [...data]
//     updated[index].pinned = !updated[index].pinned
//     updated.sort((a, b) => Number(b.pinned) - Number(a.pinned))
//     setData(updated)
//   }

//   const handleSearch = () => {
//     if (onSearch) onSearch(searchQuery)
//   }

//   return (
//     <div className='font-sans'>
//       <Card className='overflow-hidden rounded-2xl'>
//         {/* Title */}
//         <div className='p-6'>
//           <p className='text-[24px] font-semibold'>Messages</p>
//         </div>
//         <hr className='border-ring -mx-6 w-[calc(100%+3rem)]' />

//         {/* Tabs + Search */}
//         <div className='p-6 space-y-3'>
//           <div className='flex justify-center items-center gap-3 text-[14px]'>
//             <button
//               onClick={() => setActiveTab('messages')}
//               className={cn(
//                 'font-semibold transition-colors',
//                 activeTab === 'messages' ? 'text-foreground' : 'text-ring'
//               )}
//             >
//               All messages
//             </button>
//             <div className='h-5 w-[0.3px] bg-ring'></div>
//             <button
//               onClick={() => setActiveTab('projects')}
//               className={cn(
//                 'flex gap-1 font-semibold items-center transition-colors hover:cursor-pointer',
//                 activeTab === 'projects' ? 'text-foreground' : 'text-ring'
//               )}
//             >
//               <span className='text-[20px] font-bold'>{projectCount}</span> running projects
//             </button>
//           </div>

//           {/* Search bar */}
//           <div className='relative'>
//             <Search
//               onClick={handleSearch}
//               className='absolute left-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer transition-transform duration-150 hover:scale-110'
//               size={18}
//             />
//             <Input
//               className='pl-10 bg-primary/20 placeholder:text-primary'
//               placeholder='Search or start a new chat'
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//         </div>

//         <hr className='border-ring -mx-6 w-[calc(100%+3rem)]' />

//         {/* Scrollable List */}
//         <div className='max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/60 scrollbar-track-transparent'>
//           <AnimatePresence initial={false}>
//             {activeTab === 'messages' ? (
//               data.map((n, idx) => (
//                 <motion.div
//                   key={idx}
//                   layout
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   transition={{ duration: 0.25 }}
//                 >
//                   <Message
//                     props={{
//                       name: n.name,
//                       textmessage: n.textmessage,
//                       day: n.day,
//                       time: n.time
//                     }}
//                   >
//                     <Star
//                       onClick={() => togglePin(idx)}
//                       className={cn(
//                         'cursor-pointer transition-transform duration-150 hover:scale-110',
//                         n.pinned ? 'text-primary fill-primary' : 'text-ring'
//                       )}
//                       size={16}
//                     />
//                   </Message>
//                   <hr className='border-ring -mx-6 w-[calc(100%+3rem)]' />
//                 </motion.div>
//               ))
//             ) : (
//               <motion.div
//                 key='projects'
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <RunningProjects projects={projects} />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </Card>
//     </div>
//   )
// }











