import KeyValue from '@/components/atoms/keyvalue-pair'
import Pills from '@/components/atoms/pills'
import BasicInfo from '@/components/molecules/profile/basic-info'
import Subcard from '@/components/molecules/profile/subcard'
import React from 'react'

type ProfileProps = {
    fullname: string
    role: string
    location?: {
      state?: string
      country?: string
    }
    socials?: string
    image?: string
}

type Details = {
  keyRoles: string[]
  workStyles?: string[]
  skills?: string[]
}

type Experience = {
  title: string
  date: string
}

type Needs = {
  coFounder?: string[]
  CurrentSkills?: string[]
  Industry?: string[]
}

type Projects = {
  name: string
  description: string
  status: string
  link?: string
}



const Profile = ({basicInfo, bio, details, experience, needs, projects }: {basicInfo: ProfileProps, bio?: string, details: Details, experience?: Experience[], needs?: Needs, projects?: Projects}) => {
  const Details = [
  {
    title: 'Key Roles',
    subdetails: details.keyRoles
  },
  {
    title: 'Work Styles',
    subdetails: details.workStyles
  },
  {
    title: 'Skills & Strengths',
    subdetails: details.skills
  },
]



const Needs = [
  {
    title: 'Type of co-founder',
    details: needs?.coFounder
  },
  {
    title: 'Current stage',
    details: needs?.CurrentSkills
  },
  {
    title: 'Industry or sector',
    details: needs?.Industry
  },
]

const Projects = [
  {
    key: 'Project name',
    value: projects?.name
  },
  {
    key: 'Project description',
    value: projects?.description
  },
  {
    key: 'Project status',
    value: projects?.status
  },
  {
    key: 'Website link',
    value: projects?.link
  },
]
  return (
    <div className='bg-background md:rounded-[20px]  space-y-4'>
      <BasicInfo props={{
        name: basicInfo.fullname,
        role: basicInfo.role,
        location: {
          state: basicInfo.location?.state,
          country: basicInfo.location?.country
        },
        socials: basicInfo.socials
      }} />

      <div className='p-4 space-y-4'>
        <KeyValue label={{
          value: 'Bio',
          className: 'font-bold md:text-[24px] text-[18px]'
        }}>
          <p>A ”Product designer passionate about FinTech and solving real world problems”</p>
        </KeyValue>

        <div className='md:flex gap-3 w-full py-2 space-y-3'>
          {Details.map((detail, idx) => (
            <div key={idx} className=''>
              <Subcard text={`${detail.title}`} className='text-[16px] font-semibold '>
                <div key={idx} className='flex flex-wrap gap-2 w-full max-w-full pt-[10px]'>
                  {detail.subdetails?.map((subdetail, idx) => (
                    <Pills key={idx} text={`${subdetail}`} />
                  ))}
                </div>
              </Subcard>
            </div>
          ))}
        </div>

        <Subcard text='Experience' className='text-[16px] font-semibold '>
          <div className='md:flex justify-between pt-[10px] space-y-3'>
            { experience?.map((ex, idx) => (
              <div key={idx}>
              <KeyValue label={{ value: ex.title, className: 'font-[500] text-[16px]' }}>
                <p className='text-[14px] text-muted-foreground'>{ex.date}</p>
              </KeyValue>
              </div>
            ))}
          </div>
        </Subcard>

        <Subcard text='What John is looking for'  className='text-[16px] font-semibold '>
          <div className='md:flex justify-between gap-2 space-y-3'>
            {Needs.map((need, idx) => (
              <div key={idx} className='flex flex-wrap items-center gap-2 pt-[10px]'>
                <p className='text-[13px] font-[500]'>{need.title}:</p>
                <div>
                <div className='flex flex-wrap gap-2 w-full max-w-full'>
                  {need.details?.map((detail, idx) => (
                      <Pills key={idx} text={detail} />
                  ))}
                </div>
                </div>
              </div>
            ))}
          </div>
        </Subcard>

        <hr />

        <KeyValue label={{ value: 'Startup or project', className: 'font-semibold text-[18px] ' }} className='md:p-4'>
          <div className='pt-[10px] space-y-2'>
            {Projects.map((project, idx) => (
              <div key={idx} className='text-[14px]'> {project.key}: {project.value} </div>
            ))}
          </div>
        </KeyValue>
      </div>
    </div>
  )
}

export default Profile