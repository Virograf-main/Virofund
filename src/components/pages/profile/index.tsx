import KeyValue from '@/components/atoms/keyvalue-pair'
import Pills from '@/components/atoms/pills'
import BasicInfo from '@/components/molecules/profile/basic-info'
import Subcard from '@/components/molecules/profile/subcard'
import React from 'react'

type ProfileProps = {}

const details = [
  {
    title: 'Key Roles',
    subdetails: ['Full time', 'Senior level', 'Flexible schedule']
  },
  {
    title: 'Work Styles',
    subdetails: ['Full time', 'Senior level', 'Flexible schedule']
  },
  {
    title: 'Skills & Strengths',
    subdetails: ['Full time', 'Senior level', 'Flexible schedule']
  },
]

const Experience = [
  {
    title: 'UI Team lead at Tech solutions',
    date: 'Jul 2022-2024'
  }, {
    title: 'UI Team lead at Tech solutions',
    date: 'Jul 2022-2024'
  }, {
    title: 'UI Team lead at Tech solutions',
    date: 'Jul 2022-2024'
  },
]

const Needs = [
  {
    title: 'Type of co-founder',
    details: ['Tech co-founder', 'Business owner', 'Business owner', 'Business owner']
  },
  {
    title: 'Current stage',
    details: ['Tech co-founder', 'Business owner']
  },
  {
    title: 'Industry or sector',
    details: ['Tech co-founder', 'Business owner']
  },
]

const Projects = [
  {
    key: 'Project name',
    value: 'FlipConnect'
  },
  {
    key: 'Project description',
    value: 'FlipConnect'
  },
  {
    key: 'Project status',
    value: 'FlipConnect'
  },
  {
    key: 'Website link',
    value: 'FlipConnect'
  },
]

const Profile = () => {
  return (
    <div className='bg-background rounded-[20px]  space-y-4'>
      <BasicInfo props={{
        name: 'Clinton John',
        role: 'UI/UX DESIGNER',
        location: {
          state: 'Lagos',
          country: 'Nigeria'
        },
        socials: 'LinkedIn-Github'
      }} />

      <div className='p-4 space-y-4'>
        <KeyValue label={{
          value: 'Bio',
          className: 'font-bold text-[24px] '
        }}>
          <p>A ”Product designer passionate about FinTech and solving real world problems”</p>
        </KeyValue>

        <div className='flex gap-3 w-full py-2'>
          {details.map((detail, idx) => (
            <div key={idx}>
              <Subcard text={`${detail.title}`} className='text-[16px] font-semibold '>
                <div key={idx} className='flex gap-2 pt-[10px]'>
                  {detail.subdetails.map((subdetail, idx) => (
                    <Pills key={idx} text={`${subdetail}`} />
                  ))}
                </div>
              </Subcard>
            </div>
          ))}
        </div>

        <Subcard text='Experience' className='text-[16px] font-semibold '>
          <div className='flex justify-between pt-[10px]'>
            {Experience.map((ex, idx) => (
              <div key={idx}>
              <KeyValue label={{ value: ex.title, className: 'font-[500] text-[16px]' }}>
                <p className='text-[14px] text-muted-foreground'>{ex.date}</p>
              </KeyValue>
              </div>
            ))}
          </div>
        </Subcard>

        <Subcard text='What John is looking for'  className='text-[16px] font-semibold '>
          <div className='flex justify-between'>
            {Needs.map((need, idx) => (
              <div key={idx} className='flex flex-wrap items-center gap-2 pt-[10px]'>
                <p className='text-[13px] font-[500]'>{need.title}:</p>
                <div>
                <div className='flex gap-1'>
                  {need.details.map((detail, idx) => (
                      <Pills key={idx} text={detail} />
                  ))}
                </div>
                </div>
              </div>
            ))}
          </div>
        </Subcard>

        <hr />

        <KeyValue label={{ value: 'Startup or project', className: 'font-semibold text-[18px] ' }} className='p-4'>
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