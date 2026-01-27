import { UploadZone } from "@/features/upload/components/UploadZone"

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Figment</h1>
      <UploadZone />
    </div>
  )
}
