import dynamic from 'next/dynamic'

const PeopleOSHub = dynamic(
  () => import('../components/PeopleOSHub'),
  { ssr: false }
)

export default function Home() {
  return <PeopleOSHub />
}
