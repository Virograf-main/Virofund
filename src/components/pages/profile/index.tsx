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

const Profile = () => {
  return (
    <div className='bg-background rounded-[20px] p-4'>
      <BasicInfo props={{
        name: 'Clinton John',
        role: 'UI/UX DESIGNER',
        location: {
          state: 'Lagos',
          country: 'Nigeria'
        },
        socials: 'LinkedIn-Github'
      }}/>
      <hr className=''/>
      <KeyValue label={{
        value: 'Bio'
      }}>
        <p>A ”Product designer passionate about FinTech and solving real world problems”</p>
      </KeyValue>
      <div className='flex justify-between'>
        { details.map((detail, idx) => (
          <div key={idx}>
          <Subcard text={`${detail.title}`}>
            { detail.subdetails.map((subdetail, idx) => (
              <div key={idx} className='flex gap-2'>
              <Pills text={`${subdetail}`}/>
              </div>
            ))}
          </Subcard>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Profile