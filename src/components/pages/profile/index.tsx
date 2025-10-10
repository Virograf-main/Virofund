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
    title: 'Key Roles',
    subdetails: ['Full time', 'Senior level', 'Flexible schedule']
  },
  {
    title: 'Key Roles',
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
    details: ['Tech co-founder', 'Business owner']
  },
  {
    title: 'Type of co-founder',
    details: ['Tech co-founder', 'Business owner']
  },
  {
    title: 'Type of co-founder',
    details: ['Tech co-founder', 'Business owner']
  },
]

const Projects = [
  {
    key: 'Project Name',
    value: 'FlipConnect'
  },
  {
    key: 'Project Name',
    value: 'FlipConnect'
  },
  {
    key: 'Project Name',
    value: 'FlipConnect'
  },
  {
    key: 'Project Name',
    value: 'FlipConnect'
  },
]

const Profile = () => {
  return (
    <div className='bg-background rounded-[20px] p-4 space-y-4'>
      <BasicInfo props={{
        name: 'Clinton John',
        role: 'UI/UX DESIGNER',
        location: {
          state: 'Lagos',
          country: 'Nigeria'
        },
        socials: 'LinkedIn-Github'
      }} />
      <hr className='' />

      <KeyValue label={{
        value: 'Bio'
      }}>
        <p>A ”Product designer passionate about FinTech and solving real world problems”</p>
      </KeyValue>

      <div className='flex justify-between'>
        {details.map((detail, idx) => (
          <div key={idx}>
            <Subcard text={`${detail.title}`} className='text-[16px] font-semibold'>
              <div key={idx} className='flex gap-2'>
                {detail.subdetails.map((subdetail, idx) => (
                  <Pills text={`${subdetail}`} />
                ))}
              </div>
            </Subcard>
          </div>
        ))}
      </div>

      <Subcard text='Experience'>
        <div className='flex justify-between'>
          {Experience.map((ex, idx) => (
            <KeyValue label={{ value: ex.title }}>
              <p>{ex.date}</p>
            </KeyValue>
          ))}
        </div>
      </Subcard>

      <Subcard text='What John is looking for'>
        <div className='flex justify-between'>
          {Needs.map((need, idx) => (
            <div key={idx} className='flex gap-2'>
              <p>{need.title}:</p>
              <div className='flex gap-1'>
                {need.details.map((detail, idx) => (
                  <div key={idx}>
                    <Pills text={detail} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Subcard>

      <hr/>

      <KeyValue label={{value: 'Startup or project'}}>
        <div>
          {Projects.map((project, idx) => (
            <div key={idx} className=''> {project.key}: {project.value} </div>
          ))}
        </div>
      </KeyValue>
    </div>
  )
}

export default Profile