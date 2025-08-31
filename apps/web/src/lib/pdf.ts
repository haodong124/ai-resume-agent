import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export interface ExportOptions {
  filename?: string
  scale?: number
  format?: 'a4' | 'letter'
  orientation?: 'portrait' | 'landscape'
}

export class PDFExporter {
  static async exportToPDF(
    element: HTMLElement,
    options: ExportOptions = {}
  ): Promise<void> {
    const {
      filename = `Resume_${new Date().toISOString().split('T')[0]}.pdf`,
      scale = 2,
      format = 'a4',
      orientation = 'portrait',
    } = options
    
    try {
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      })
      
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format,
      })
      
      const imgWidth = pdf.internal.pageSize.getWidth()
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const imgData = canvas.toDataURL('image/png', 1.0)
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(filename)
      
    } catch (error) {
      console.error('PDF export failed:', error)
      throw new Error('PDF导出失败，请重试')
    }
  }
  
  static async exportToImage(
    element: HTMLElement,
    format: 'png' | 'jpeg' = 'png'
  ): Promise<void> {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })
    
    const link = document.createElement('a')
    link.download = `Resume_${new Date().toISOString().split('T')[0]}.${format}`
    link.href = canvas.toDataURL(`image/${format}`, 0.95)
    link.click()
  }
}

export class PrintHelper {
  static print(element: HTMLElement): void {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('请允许弹出窗口以打印简历')
      return
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>打印简历</title>
          <style>
            body { margin: 0; font-family: system-ui, sans-serif; }
            @media print {
              body { margin: 0; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
        </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.focus()
    
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }
}
