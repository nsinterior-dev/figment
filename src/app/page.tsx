import { Workspace } from "@/features/workspace/components/Workspace"
import { Heading } from "@/components/ui"

export default function Home() {
  return (
    <div className="p-8">
      <Heading level={2}>Figment</Heading>
      <Workspace />
    </div>
  )
}
