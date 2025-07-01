
import { FileProcessorTool } from '@/components/FileProcessorV0'
import React from 'react'

function page() {
  return (
     <main className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            📄 File Processor
          </h1>
          <p className="text-muted-foreground">Dosya işleme ve veri analiz araçları</p>
        </div>
        <FileProcessorTool />
      </div>
    </main>
  )
}

export default page
