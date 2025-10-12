import Profile from '@/components/pages/profile'
import React from 'react'

const page = () => {
  return (
    <div>
      <Profile
        basicInfo={{
          fullname: 'Clinton John',
          role: 'UI/UX Designer',
          location: {
            state: 'Lagos',
            country: 'Nigeria'
          },
          socials: 'LinkedIn - GitHub',
          image: '/images/clinton.jpg',
        }}
        bio='Building products that make money move easier.'
        details={{
          keyRoles: ['Full time', 'Senior level'],
          workStyles: ['Remote', 'Flexible'],
          skills: ['Figma', 'User Research', 'Prototyping'],
        }}
        experience={[
          { title: 'UI Team Lead at Tech Solutions', date: 'Jul 2022 - 2024' },
          { title: 'Product Designer at FlipConnect', date: 'Jan 2021 - Jun 2022' },
          { title: 'Design Intern at DigitalCraft', date: 'Aug 2020 - Dec 2020' },
        ]}
        needs={{
          coFounder: ['Tech co-founder'],
          CurrentSkills: ['UI/UX', 'Leadership'],
          Industry: ['FinTech', 'Design'],
        }}
        projects={{
          name: 'FlipConnect',
          description: 'A social fintech platform connecting users and payments',
          status: 'In Progress',
          link: 'https://flipconnect.io',
        }}
      />

    </div>
  )
}

export default page