'use client'

import React from 'react'
import { Timer } from 'lucide-react'

type ProjectData = {
  name: string
  textmessage: string
  day: string
  time: string
}

type RunningProjectsProps = {
  projects: ProjectData[]
}

export const RunningProjects = ({ projects }: RunningProjectsProps) => {
  return (
    <div className='divide-y font-sans'>
      {projects.map((proj, idx) => (
        <div key={idx} className='p-6 font-medium bg-background font-sans'>
          <div className='flex flex-col gap-2'>
            <p className='text-[12px] font-bold'>{proj.name}</p>
            <p className='text-[10px] font-[500]'>{proj.textmessage}</p>
            <div className='flex items-center gap-1 text-[10px] text-ring'>
              <Timer size={10} />
              <p>{proj.day}</p>
              <p>{proj.time}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
