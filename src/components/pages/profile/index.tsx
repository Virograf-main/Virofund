import KeyValue from '@/components/atoms/keyvalue-pair'
import BasicInfo from '@/components/molecules/profile/basic-info'
import React from 'react'

type ProfileProps = {}

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
    </div>
  )
}

export default Profile